var inherit = require( 'bloodline' )
var util = require( 'util' )
var tty = require( 'tty' )
var isBuffer = Buffer.isBuffer

const initial = [ 0xFE, 0xFF, 0xFF ]

/**
 * CHS
 * @param {Number} cylinder
 * @param {Number} head
 * @param {Number} sector
 * @return {CHS}
 */
function CHS( cylinder, head, sector ) {
  
  if( !(this instanceof CHS) )
    return new CHS( cylinder, head, sector )
  
  Buffer.call( this, 3 )
  
  this[0] = 0xFE
  this[1] = 0xFF
  this[2] = 0xFF
  
  // ( buffer, from, to )
  if( isBuffer( cylinder ) ) {
    cylinder.copy( this, 0, head, sector )
  } else {
    this.cylinder = cylinder
    this.head = head
    this.sector = sector
  }
  
}

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
  
  get head() {
    return this[0]
  },
  
  // Sector in bits 5–0;
  // bits 7–6 are high bits of cylinder
  // 00111111b
  get sector() {
    return this[1] & 0x3F
  },
  
  // Bits 7-6 from sector & bits 7–0 of cylinder
  // 11000000b
  get cylinder() {
    return ( ( this[1] & 0xC0 ) << 2 ) | this[2]
  },
  
  set head( value ) {
    this[0] = value
  },
  
  set sector( value ) {
    var sector = ( value >> 2 ) & 0xC0
    sector = sector ^ value
    this[1] = sector
  },
  
  set cylinder( value ) {
    this[2] = value & 0xFF
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
  },
  
  toJSON: function() {
    return {
      cylinder: this.cylinder,
      head: this.head,
      sector: this.sector,
    }
  },
  
  inspect: function() {
    return '<' + this.constructor.name + ' ' +
      util.inspect( this.toJSON(), {
        colors: tty.isatty()
      }) + '>'
  },
  
}

// Inherit from Buffer
inherit( CHS, Buffer )
// Exports
module.exports = CHS
