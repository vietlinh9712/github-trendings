import { describe, it, expect } from 'vitest';
import { Cache } from '../src/lib/cache';

describe('Cache', () => {
  it('returns null for missing keys', () => {
    const c = new Cache();
    expect(c.get('nonexistent')).toBeNull();
  });

  it('stores and retrieves values', () => {
    const c = new Cache();
    c.set('key', { value: 42 });
    expect(c.get<{ value: number }>('key')).toEqual({ value: 42 });
  });

  it('returns null after TTL expires', async () => {
    const c = new Cache();
    c.set('key', { value: 1 }, 10); // 10ms TTL
    await new Promise(r => setTimeout(r, 20));
    expect(c.get('key', 10)).toBeNull();
  });

  it('returns cached value within TTL', async () => {
    const c = new Cache();
    c.set('key', { value: 1 }, 1000); // 1s TTL
    await new Promise(r => setTimeout(r, 5));
    expect(c.get<{ value: number }>('key', 1000)).toEqual({ value: 1 });
  });

  it('clears all entries', () => {
    const c = new Cache();
    c.set('a', 1);
    c.set('b', 2);
    c.clear();
    expect(c.get('a')).toBeNull();
    expect(c.get('b')).toBeNull();
  });

  it('tracks hits and misses', () => {
    const c = new Cache();
    c.get('missing'); // miss
    c.set('found', 1);
    c.get('found'); // hit
    const stats = c.stats();
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(1);
    expect(stats.size).toBe(1);
  });
});
