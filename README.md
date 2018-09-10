# LRU [![Build Status](https://travis-ci.org/zcorky/lru.svg?branch=master)](https://travis-ci.org/zcorky/lru)

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