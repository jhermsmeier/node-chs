# CHS - Cylinder Head Sector Address
[![build status](https://secure.travis-ci.org/jhermsmeier/node-chs.png)](http://travis-ci.org/jhermsmeier/node-chs)
[![NPM version](https://badge.fury.io/js/chs.png)](https://npmjs.org/chs)


## Install via [npm](https://npmjs.org)

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
