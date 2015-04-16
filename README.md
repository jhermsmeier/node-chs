# chs
[![npm](http://img.shields.io/npm/v/chs.svg?style=flat-square)](https://npmjs.com/chs)
[![npm downloads](http://img.shields.io/npm/dm/chs.svg?style=flat-square)](https://npmjs.com/chs)
[![build status](http://img.shields.io/travis/jhermsmeier/node-chs.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-chs)

## Install via [npm](https://npmjs.com)

```sh
$ npm install chs
```

## Usage

```js
// Load module
var CHS = require( 'chs' )
// Create a CHS address
var addr = new CHS( 5, 20, 8 )
// Properties:
var c = addr.cylinder
var h = addr.head
var s = addr.sector
// Convert to an LBA (Logical Block Address)
var lba = addr.toLBA( headsPerTrack, sectorsPerTrack )
var lba = addr.toLBA( 12, 32 )
// Set it to an LBA
addr.setLBA( lba, headsPerTrack, sectorsPerTrack )
addr.setLBA( 3150, 16, 63 )
// Get it as a buffer
var buf = addr.buffer
// Set from buffer
addr.buffer = new Buffer([ 0xFE, 0xFF, 0xFF ])
```
