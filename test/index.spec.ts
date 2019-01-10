import { delay as sleep } from '@zcorky/delay';
import { lru as LRU } from '../src';

export interface Value {
  name: 'zero',
  age: 12,
};

describe('Lru tests', () => {
  describe('create instance', () => {
    it('using new', () => {
      const lru = new LRU<string, number>(10);
      expect(lru instanceof LRU).toEqual(true);
    });

    it('using create', () => {
      const lru = LRU.create<string, number>(10);
      expect(lru instanceof LRU).toEqual(true);
    });
  });

  describe('key & value', () => {
    it('key is string', () => {
      const lru = new LRU<string, string>(10);
      lru.set('foo', 'bar');
      expect(lru.get('foo')).toEqual('bar');
    });

    it('key is number', () => {
      const lru = new LRU<number, string>(10);
      lru.set(1, 'bar');
      expect(lru.get(1)).toEqual('bar');
    });

    it('key is object', () => {
      const lru = new LRU<object, string>(10);
      const obj = { hi: 'foo' };
      lru.set(obj, 'bar');
      expect(lru.get(obj)).toEqual('bar');
    });

    it('value is empty value', () => {
      const lru = new LRU<string, any>(10);
      lru.set('foo', 'bar');
      expect(lru.get('foo')).toEqual('bar');
      lru.set('foo', null);
      expect(lru.get('foo')).toEqual(null);
      lru.set('foo', undefined);
      expect(lru.get('foo')).toEqual(undefined);
      lru.set('foo', 0);
      expect(lru.get('foo')).toEqual(0);
      lru.set('foo', '');
      expect(lru.get('foo')).toEqual('');
    });

    it('value is object', () => {
      const lru = new LRU<string, { foo: string }>(10);
      lru.set('foo', { foo: 'bar' });
      expect(lru.get('foo')!.foo).toEqual('bar');
    });

    it('expired value should not copy', async () => {
      const lru = new LRU<string, string>(2);
      lru.set('foo1', 'bar');
      lru.set('foo', 'bar', { maxAge: 2 });

      expect((lru as any).cache.size).toEqual(0);
      expect((lru as any)._cache.size).toEqual(2);
      // expect(lru.get('foo1', { maxAge: 2 })).toEqual('bar');

      await sleep(10);
      expect(lru.get('foo')).toEqual(undefined);
      expect(lru.get('foo1')).toEqual('bar');
      expect((lru as any).cache.size).toEqual(1);
      expect((lru as any)._cache.size).toEqual(2);

      await sleep(10);
      expect(lru.get('foo')).toEqual(undefined);
      expect(lru.get('foo1')).toEqual('bar');
      expect((lru as any).cache.size).toEqual(1);
      expect((lru as any)._cache.size).toEqual(2);

      lru.set('foo2', 'bar');
      expect((lru as any).cache.size).toEqual(0);
      expect((lru as any)._cache.size).toEqual(2);
      expect(lru.get('foo')).toEqual(undefined);
      expect(lru.get('foo2')).toEqual('bar');
      expect((lru as any).cache.size).toEqual(1);
      expect((lru as any)._cache.size).toEqual(2);
    });
  });

  describe('set with options.maxAge', () => {
    [1, 10, 100, 1000, 1500].forEach(maxAge => {
      it(`maxAge=${maxAge}`, async () => {
        const lru = new LRU<string | number, string | number | object>(10);
        lru.set(1, 0, { maxAge });
        lru.set('k2', 'v2', { maxAge });
        lru.set('k3', { foo: 'bar' }, { maxAge });

        expect(lru.get(1)).toEqual(0);
        expect(lru.get('k2')).toEqual('v2');
        expect((lru.get('k3') as any).foo).toEqual('bar');

        await sleep(maxAge + 10);
        expect(lru.get(1)).toEqual(undefined);
        expect(lru.get('k2')).toEqual(undefined);
        expect(lru.get('k3')).toEqual(undefined);
      });
    });
  });

  describe('get with options.maxAge', () => {
    [100, 1000, 1500].forEach(maxAge => {
      it(`maxAge=${maxAge}`, async () => {
        const lru = new LRU<string | number, string | number | object>(10);
        lru.set(1, 0, { maxAge });
        lru.set('k2', 'v2', { maxAge });
        lru.set('k3', { foo: 'bar' }, { maxAge });

        expect(lru.get(1)).toEqual(0);
        expect(lru.get('k2')).toEqual('v2');
        expect((lru.get('k3') as any).foo).toEqual('bar');

        await sleep(maxAge - 10);
        expect(lru.get(1, { maxAge })).not.toBe(undefined);
        expect(lru.get('k2', { maxAge })).not.toBe(undefined);
        expect(lru.get('k3', { maxAge })).not.toBe(undefined);

        await sleep(maxAge - 10);
        expect(lru.get(1, { maxAge })).not.toBe(undefined);
        expect(lru.get('k2', { maxAge })).not.toBe(undefined);
        expect(lru.get('k3', { maxAge })).not.toBe(undefined);
        expect(lru.get(1, { maxAge })).not.toBe(undefined);
        expect(lru.get('k2', { maxAge })).not.toBe(undefined);
        expect(lru.get('k3', { maxAge })).not.toBe(undefined);
      });
    });

    it('can update expired when item in _cache', async () => {
      const lru = new LRU<string, string>(2);
      lru.set('foo1', 'bar');
      lru.set('foo2', 'bar', { maxAge: 100 });
      lru.get('foo1', { maxAge: 100 });

      await sleep(50);
      expect(lru.get('foo1')).toEqual('bar');
      expect(lru.get('foo2', { maxAge: 0 })).toEqual('bar');
      expect(lru.get('foo2', { maxAge: 0 })).toEqual('bar');
      expect(lru.get('foo2', { maxAge: 0 })).toEqual('bar');

      await sleep(120);
      expect(lru.get('foo')).toEqual(undefined);
      expect(lru.get('foo2')).toEqual('bar');
    });
  });
})
