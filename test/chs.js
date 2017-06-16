var assert = require( 'assert' )
var CHS = require( '../' )

describe( 'CHS', function() {

  describe( 'Value ranges', function() {

    specify( 'CHS(0/0/0)', function() {
      var chs = new CHS( 0, 0, 0 )
      assert.deepEqual( CHS.fromBuffer( chs.toBuffer() ), chs )
    })

    specify( 'CHS(8/4/32)', function() {
      var chs = new CHS( 8, 4, 32 )
      assert.deepEqual( CHS.fromBuffer( chs.toBuffer() ), chs )
    })

    specify( 'CHS(1023/254/63)', function() {
      var chs = new CHS( 1023, 254, 63 )
      assert.deepEqual( CHS.fromBuffer( chs.toBuffer() ), chs )
    })

    specify( 'CHS(1234/268/76) (overflow)', function() {
      var chs = new CHS( 1234, 268, 76 )
      var expected = new CHS( 1234 & 0x03FF, 268 & 0xFF, 76 & 0x3F )
      var actual = CHS.fromBuffer( chs.toBuffer() )
      assert.deepEqual( actual, expected )
    })

  })

  describe( 'Map LBAs corresponding to geometry', function() {

    // For geometry 1020 16 63 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA  3150=(3*16+2)* 63
    specify( 'Geometry 1020 16 63', function() {
      var chs = new CHS( 3, 2, 1 )
      assert.equal( chs.toLBA( 16, 63 ), 3150 )
    })

    // For geometry 1008 4 255 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA  3570=(3*4+2)*255
    specify( 'Geometry 1008 4 255', function() {
      var chs = new CHS( 3, 2, 1 )
      assert.equal( chs.toLBA( 4, 255 ), 3570 )
    })

    // For geometry 64 255 63 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA 48321=(3*255+2)* 63
    specify( 'Geometry 64 255 63', function() {
      var chs = new CHS( 3, 2, 1 )
      assert.equal( chs.toLBA( 255, 63 ), 48321 )
    })

    // For geometry 2142 15 32 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA  1504=(3*15+2)* 32
    specify( 'Geometry 2142 15 32', function() {
      var chs = new CHS( 3, 2, 1 )
      assert.equal( chs.toLBA( 15, 32 ), 1504 )
    })

  })

  describe( 'Map CHS to a given LBA with geometry', function() {

    // For geometry 1020 16 63 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA  3150=(3*16+2)* 63
    specify( 'Geometry 1020 16 63', function() {
      var chs = new CHS()
      chs.setLBA( 3150, 16, 63 )
      assert.equal( chs.cylinder, 3 )
      assert.equal( chs.head, 2 )
      assert.equal( chs.sector, 1 )
    })

    // For geometry 1008 4 255 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA  3570=(3*4+2)*255
    specify( 'Geometry 1008 4 255', function() {
      var chs = new CHS()
      chs.setLBA( 3570, 4, 255 )
      assert.equal( chs.cylinder, 3 )
      assert.equal( chs.head, 2 )
      assert.equal( chs.sector, 1 )
    })

    // For geometry 64 255 63 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA 48321=(3*255+2)* 63
    specify( 'Geometry 64 255 63', function() {
      var chs = new CHS()
      chs.setLBA( 48321, 255, 63 )
      assert.equal( chs.cylinder, 3 )
      assert.equal( chs.head, 2 )
      assert.equal( chs.sector, 1 )
    })

    // For geometry 2142 15 32 of a disk with
    // 1028160 sectors CHS 3 2 1 is LBA  1504=(3*15+2)* 32
    specify( 'Geometry 2142 15 32', function() {
      var chs = new CHS()
      chs.setLBA( 1504, 15, 32 )
      assert.equal( chs.cylinder, 3 )
      assert.equal( chs.head, 2 )
      assert.equal( chs.sector, 1 )
    })

  })

})
