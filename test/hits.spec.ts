// import { delay as sleep } from '@zcorky/delay';
import { lru as LRU } from '../src';

export interface Value {
  name: 'zero',
  age: 12,
};

describe('Lru hit tests', () => {
  describe('initial, rate 0', () => {
    it('using new', () => {
      const lru = new LRU<string, any>(10);
      expect(lru.hits()).toEqual({
        count: 0,
        rate: 0,
      });

      lru.set('foo', 'bar');
      expect(lru.get('foo')).toBe('bar');
      expect(lru.hits()).toEqual({
        count: 1,
        rate: 1,
      });

      lru.set('foo', null);
      expect(lru.get('foo')).toBe(null);
      expect(lru.hits()).toEqual({
        count: 2,
        rate: 1,
      });

      expect(lru.get('foo2')).toBe(undefined);
      expect(lru.hits().count).toEqual(2);
      expect(lru.hits().rate.toFixed(2)).toEqual('0.67');

      lru.set('foo', 0);
      expect(lru.get('foo3')).toBe(undefined);
      expect(lru.hits()).toEqual({
        count: 2,
        rate: 0.5,
      });

      lru.set('foo', '');
      expect(lru.get('foo')).toBe('');
      expect(lru.hits()).toEqual({
        count: 3,
        rate: 0.6,
      });
    });
  });

  // describe('key & value', () => {
  //   it('key is string', () => {
  //     const lru = new LRU<string, string>(10);
  //     lru.set('foo', 'bar');
  //     expect(lru.hits()).toEqual({
  //       count: 0,
  //       rate: 0,
  //     });
  //   });

  //   it('key is number', () => {
  //     const lru = new LRU<number, string>(10);
  //     lru.set(1, 'bar');
  //     expect(lru.get(1)).toBe('bar');
  //   });

  //   it('key is object', () => {
  //     const lru = new LRU<object, string>(10);
  //     const obj = { hi: 'foo' };
  //     lru.set(obj, 'bar');
  //     expect(lru.get(obj)).toBe('bar');
  //   });

  //   it('value is empty value', () => {
  //     const lru = new LRU<string, any>(10);
  //     lru.set('foo', 'bar');
  //     expect(lru.get('foo')).toBe('bar');
  //     lru.set('foo', null);
  //     expect(lru.get('foo')).toBe(null);
  //     lru.set('foo', undefined);
  //     expect(lru.get('foo')).toBe(undefined);
  //     lru.set('foo', 0);
  //     expect(lru.get('foo')).toBe(0);
  //     lru.set('foo', '');
  //     expect(lru.get('foo')).toBe('');
  //   });

  //   it('value is object', () => {
  //     const lru = new LRU<string, { foo: string }>(10);
  //     lru.set('foo', { foo: 'bar' });
  //     expect(lru.get('foo')!.foo).toBe('bar');
  //   });

  //   it('expired value should not copy', async () => {
  //     const lru = new LRU<string, string>(2);
  //     lru.set('foo1', 'bar');
  //     lru.set('foo', 'bar', { maxAge: 2 });

  //     expect((lru as any).cache.size).toBe(0);
  //     expect((lru as any)._cache.size).toBe(2);
  //     // expect(lru.get('foo1', { maxAge: 2 })).toBe('bar');

  //     await sleep(10);
  //     expect(lru.get('foo')).toBe(undefined);
  //     expect(lru.get('foo1')).toBe('bar');
  //     expect((lru as any).cache.size).toBe(1);
  //     expect((lru as any)._cache.size).toBe(2);

  //     await sleep(10);
  //     expect(lru.get('foo')).toBe(undefined);
  //     expect(lru.get('foo1')).toBe('bar');
  //     expect((lru as any).cache.size).toBe(1);
  //     expect((lru as any)._cache.size).toBe(2);

  //     lru.set('foo2', 'bar');
  //     expect((lru as any).cache.size).toBe(0);
  //     expect((lru as any)._cache.size).toBe(2);
  //     expect(lru.get('foo')).toBe(undefined);
  //     expect(lru.get('foo2')).toBe('bar');
  //     expect((lru as any).cache.size).toBe(1);
  //     expect((lru as any)._cache.size).toBe(2);
  //   });
  // });

  // describe('set with options.maxAge', () => {
  //   [1, 10, 100, 1000, 1500].forEach(maxAge => {
  //     it(`maxAge=${maxAge}`, async () => {
  //       const lru = new LRU<string | number, string | number | object>(10);
  //       lru.set(1, 0, { maxAge });
  //       lru.set('k2', 'v2', { maxAge });
  //       lru.set('k3', { foo: 'bar' }, { maxAge });

  //       expect(lru.get(1)).toBe(0);
  //       expect(lru.get('k2')).toBe('v2');
  //       expect((lru.get('k3') as any).foo).toBe('bar');

  //       await sleep(maxAge + 10);
  //       expect(lru.get(1)).toBe(undefined);
  //       expect(lru.get('k2')).toBe(undefined);
  //       expect(lru.get('k3')).toBe(undefined);
  //     });
  //   });
  // });

  // describe('get with options.maxAge', () => {
  //   [100, 1000, 1500].forEach(maxAge => {
  //     it(`maxAge=${maxAge}`, async () => {
  //       const lru = new LRU<string | number, string | number | object>(10);
  //       lru.set(1, 0, { maxAge });
  //       lru.set('k2', 'v2', { maxAge });
  //       lru.set('k3', { foo: 'bar' }, { maxAge });

  //       expect(lru.get(1)).toBe(0);
  //       expect(lru.get('k2')).toBe('v2');
  //       expect((lru.get('k3') as any).foo).toBe('bar');

  //       await sleep(maxAge - 10);
  //       expect(lru.get(1, { maxAge })).to.not.equal(undefined);
  //       expect(lru.get('k2', { maxAge })).to.not.equal(undefined);
  //       expect(lru.get('k3', { maxAge })).to.not.equal(undefined);

  //       await sleep(maxAge - 10);
  //       expect(lru.get(1, { maxAge })).to.not.equal(undefined);
  //       expect(lru.get('k2', { maxAge })).to.not.equal(undefined);
  //       expect(lru.get('k3', { maxAge })).to.not.equal(undefined);
  //       expect(lru.get(1, { maxAge })).to.not.equal(undefined);
  //       expect(lru.get('k2', { maxAge })).to.not.equal(undefined);
  //       expect(lru.get('k3', { maxAge })).to.not.equal(undefined);
  //     });
  //   });

  //   it('can update expired when item in _cache', async () => {
  //     const lru = new LRU<string, string>(2);
  //     lru.set('foo1', 'bar');
  //     lru.set('foo2', 'bar', { maxAge: 100 });
  //     lru.get('foo1', { maxAge: 100 });

  //     await sleep(50);
  //     expect(lru.get('foo1')).toBe('bar');
  //     expect(lru.get('foo2', { maxAge: 0 })).toBe('bar');
  //     expect(lru.get('foo2', { maxAge: 0 })).toBe('bar');
  //     expect(lru.get('foo2', { maxAge: 0 })).toBe('bar');

  //     await sleep(120);
  //     expect(lru.get('foo')).toBe(undefined);
  //     expect(lru.get('foo2')).toBe('bar');
  //   });
  // });
})
