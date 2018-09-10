import { expect } from 'chai';
import { delay } from '@zcorky/delay';
import { lru as LRU } from '../src';

export interface Value {
  name: 'zero',
  age: 12,
};

describe('Lru tests', () => {
  describe('normal', () => {
    it('key is string', () => {
      const lru = new LRU<string, string>(10);
      lru.set('foo', 'bar');
      expect(lru.get('foo')).to.equal('bar');
    });

    it('key is number', () => {
      const lru = new LRU<number, string>(10);
      lru.set(1, 'bar');
      expect(lru.get(1)).to.equal('bar');
    });

    it('key is object', () => {
      const lru = new LRU<object, string>(10);
      const obj = { hi: 'foo' };
      lru.set(obj, 'bar');
      expect(lru.get(obj)).to.equal('bar');
    });

    it('value is empty value', () => {
      const lru = new LRU<string, any>(10);
      lru.set('foo', 'bar');
      expect(lru.get('foo')).to.equal('bar');
      lru.set('foo', null);
      expect(lru.get('foo')).to.equal(null);
      lru.set('foo', undefined);
      expect(lru.get('foo')).to.equal(undefined);
      lru.set('foo', 0);
      expect(lru.get('foo')).to.equal(0);
      lru.set('foo', '');
      expect(lru.get('foo')).to.equal('');
    });

    it('value is object', () => {
      const lru = new LRU<string, { foo: string }>(10);
      lru.set('foo', { foo: 'bar' });
      expect((lru.get('foo') as { foo: string }).foo).to.equal('bar');
    });

    it('expired value should not copy', async () => {
      const lru = new LRU<string, string>(2);
      lru.set('foo1', 'bar');
      lru.set('foo', 'bar', { maxAge: 2 });

      expect((lru as any).cache.size).to.equal(0);
      expect((lru as any)._cache.size).to.equal(2);

      await delay(10);
      expect(lru.get('foo')).to.equal(undefined);
      expect(lru.get('foo1')).to.equal('bar');
      expect((lru as any).cache.size).to.equal(1);
      expect((lru as any)._cache.size).to.equal(2);
    });
  })
})
