/**
 * CHS constructor
 * @param {Object|Buffer} data
 */
function CHS( cylinder, head, sector ) {
  
  if( !(this instanceof CHS) )
    return new CHS( data )
  
  this.cylinder = 0 // [0,1023]
  this.head     = 0 // [0,255]
  this.sector   = 0 // [1,63]
  
  this._buffer = new Buffer([ 0xFE, 0xFF, 0xFF ])
  
  if( cylinder instanceof Buffer ) {
    this.buffer = data
  } else {
    this.cylinder = cylinder || 0
    this.head     = head || 0
    this.sector   = sector || 0
  }
  
  // Update internal buffer
  void this.buffer
  
}

// Exports
module.exports = CHS

/**
 * Set to the CHS of a Logical Block Address
 * @param {Number} lba
 * @param {Number} hpt Heads per Track
 * @param {Number} spt Sectors per Track
 */
CHS.fromLBA = function( lba, hpt, spt ) {
  return new CHS().setLBA( lba, hpt, spt )
}

/**
 * CHS prototype
 * @type {Object}
 */
CHS.prototype = {
  
  constructor: CHS,
  
  get buffer() {
    
    var cylinder = this.cylinder & 0xFF
    var head = this.head
    var sector = ( this.cylinder >> 2 ) & 0xC0
        sector = sector ^ this.sector
    
    this._buffer[0] = head
    this._buffer[1] = sector
    this._buffer[2] = cylinder
    
    return this._buffer.slice()
    
  },
  
  set buffer( value ) {
    
    if( !(value instanceof Buffer) ) {
      throw new TypeError( 'Value must be a buffer' )
    }
    
    value.copy( this._buffer )
    
    this.head = this._buffer[0]
    
    // Sector in bits 5–0;
    // bits 7–6 are high bits of cylinder
    this.sector = this._buffer[1] & 0x3F // 00111111b
    
    // Bits 7-6 from sector & bits 7–0 of cylinder
    this.cylinder = ( this._buffer[1] & 0xC0 ) << 2 // 11000000b
    this.cylinder = this.cylinder | this._buffer[2]
    
  },
  
  /**
   * Set to the CHS of a Logical Block Address
   * @param {Number} lba
   * @param {Number} hpt Heads per Track
   * @param {Number} spt Sectors per Track
   */
  setLBA: function( lba, hpt, spt ) {
    this.cylinder = ( lba / ( spt * hpt )) | 0
    this.head     = ( lba / spt ) % hpt
    this.sector   = ( lba % spt ) + 1
    return this
  },
  
  /**
   * Get the Logical Block Address corresponding
   * to the given disk geometry
   * @param {Number} hpt Heads per Track
   * @param {Number} spt Sectors per Track
   */
  getLBA: function( hpt, spt ) {
    return ( this.cylinder * hpt + this.head ) *
      spt + ( this.sector - 1 )
  },
  
  /**
   * @see #getLBA()
   * @param {Number} hpt Heads per Track
   * @param {Number} spt Sectors per Track
   */
  toLBA: function( hpt, spt ) {
    return this.getLBA( hpt, spt )
  }
  
}
