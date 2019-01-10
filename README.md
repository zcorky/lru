# lru

[![NPM version](https://img.shields.io/npm/v/@zcorky/lru.svg?style=flat)](https://www.npmjs.com/package/@zcorky/lru)
[![NPM quality](http://npm.packagequality.com/shield/%40zcorky%2Flru.svg)](http://packagequality.com/#?package=@zcorky/lru)
[![Coverage Status](https://codecov.io/gh/zcorky/lru/branch/master/graph/badge.svg)](https://codecov.io/gh/zcorky/lru)
[![Dependencies](https://img.shields.io/david/zcorky/lru.svg?style=flat-square)](https://david-dm.org/zcorky/lru)
[![Build Status](https://travis-ci.com/zcorky/lru.svg?branch=master)](https://travis-ci.com/zcorky/lru)
[![Known Vulnerabilities](https://snyk.io/test/npm/@zcorky/lru/badge.svg?style=flat-square)](https://snyk.io/test/npm/@zcorky/lru)
[![NPM download](https://img.shields.io/npm/dm/@zcorky/lru.svg?style=flat-square)](https://www.npmjs.com/package/@zcorky/lru)
![license](https://img.shields.io/github/license/zcorky/lru.svg)
[![issues](https://img.shields.io/github/issues/zcorky/lru.svg)](https://github.com/zcorky/lru/issues)

> A simple lru lib

## Install

```
$ npm install @zcorky/lru
```


## Usage

```js
const LRU = require('@zcorky/lru').lru;
// import LRU from '@zcorky/lru'; // ts or es6

const lru = new LRU(100);
lru.set(key, value);
lru.get(key);

// value2 will be expired after 5000ms
lru.set(key2, value2, { maxAge: 5000 });
// get key and update expired
lru.get(key2, { maxAge: 5000 });
```

## License

MIT © [Moeover](https://moeover.com)