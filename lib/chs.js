/**
 * Cylinder-Head-Sector Address
 * @constructor
 * @param {(Number|Buffer)} [cylinder=1023]
 * @param {Number} [head=254]
 * @param {Number} [sector=63]
 */
function CHS( cylinder, head, sector ) {

  if( !(this instanceof CHS) )
    return new CHS( cylinder, head, sector )

  if( Buffer.isBuffer( cylinder ) )
    return CHS.fromBuffer( cylinder )

  if( cylinder != null && !Number.isFinite( cylinder ) )
    throw new TypeError( 'Cylinder must be a number' )

  if( head != null && !Number.isFinite( head ) )
    throw new TypeError( 'Head must be a number' )

  if( sector != null && !Number.isFinite( sector ) )
    throw new TypeError( 'Sector must be a number' )

  /** @type {Number} Cylinder */
  this.cylinder = cylinder != null ?
    ( cylinder | 0 ) : 1023

  /** @type {Number} Head */
  this.head = head != null ?
    ( head | 0 ) : 254

  /** @type {Number} Sector */
  this.sector = sector != null ?
    ( sector | 0 ) : 63

}

/**
 * Create a CHS Address from a given buffer
 * @param  {Buffer} buffer
 * @return {CHS}
 */
CHS.fromBuffer = function( buffer ) {
  return new CHS().parse( buffer )
}

/**
 * Create a CHS Address from a Logical Block Address (LBA)
 * @param {Number} lba Logical Block Address
 * @param {Number} hpt Heads per Track
 * @param {Number} spt Sectors per Track
 * @return {CHS}
 */
CHS.fromLBA = function( lba, hpt, spt ) {
  return new CHS().setLBA( lba, hpt, spt )
}

/**
 * CHS prototype
 * @type {Object}
 * @ignore
 */
CHS.prototype = {

  constructor: CHS,

  /** @type {Buffer} Get/set values from/to a Buffer */
  set buffer( value ) { return this.parse( value ) },
  get buffer() { return this.toBuffer() },

  /**
   * Set CHS to a Logical Block Address (LBA)
   * @param {Number} lba Logical Block Address
   * @param {Number} hpt Heads per Track
   * @param {Number} spt Sectors per Track
   * @return {CHS}
   */
  setLBA: function( lba, hpt, spt ) {
    this.cylinder = ( lba / ( spt * hpt )) | 0
    this.head     = ( lba / spt ) % hpt
    this.sector   = ( lba % spt ) + 1
    return this
  },

  /**
   * Get the Logical Block Address (LBA)
   * corresponding to the given disk geometry
   * @param {Number} hpt Heads per Track
   * @param {Number} spt Sectors per Track
   * @return {Number} lba
   */
  getLBA: function( hpt, spt ) {
    return ( this.cylinder * hpt + this.head ) *
      spt + ( this.sector - 1 )
  },

  /**
   * @see #getLBA()
   * @param {Number} hpt Heads per Track
   * @param {Number} spt Sectors per Track
   * @return {Number} lba
   */
  toLBA: function( hpt, spt ) {
    return this.getLBA( hpt, spt )
  },

  /**
   * Clone the CHS Address
   * @return {CHS}
   */
  clone: function() {
    return new CHS( this.cylinder, this.head, this.sector )
  },

  /**
   * Copy this address to a target address
   * @param {CHS} target
   * @return {CHS}
   */
  copy: function( target ) {

    target.cylinder = this.cylinder
    target.head = this.head
    target.sector = this.sector

    return target

  },

  /**
   * Parse a given Buffer
   * @param  {Buffer} buffer
   * @return {CHS}
   */
  parse: function( buffer ) {

    if( !Buffer.isBuffer( buffer ) )
      throw new TypeError( 'Value must be a buffer' )

    this.head = buffer[0]

    // Sector in bits 5–0;
    // bits 7–6 are high bits of cylinder
    // 00111111b
    this.sector = buffer[1] & 0x3F

    // Bits 7-6 from sector & bits 7–0 of cylinder
    // 11000000b
    this.cylinder = ( ( buffer[1] & 0xC0 ) << 2 ) | buffer[2]

    return this

  },

  /**
   * Create a Buffer representation of the CHS Address
   * @return {Buffer}
   */
  toBuffer: function() {

    var cylinder = this.cylinder & 0xFF
    var head = this.head
    var sector = (( this.sector >> 2 ) & 0xC0) ^ this.sector

    return new Buffer([ head, sector, cylinder ])

  },

}

// Exports
module.exports = CHS
