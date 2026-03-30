import { describe, it, expect } from 'vitest';
import { formatTable, formatJSON } from '../src/lib/formatter';
import { ScoredRepo } from '../src/types';

const makeScoredRepo = (overrides: Partial<ScoredRepo> = {}): ScoredRepo => ({
  name: 'test-repo',
  full_name: 'test/test-repo',
  description: 'A test repository',
  stargazers_count: 100,
  language: 'TypeScript',
  html_url: 'https://github.com/test/test-repo',
  created_at: new Date().toISOString(),
  topics: [],
  pushed_at: new Date().toISOString(),
  score: 10.5,
  velocity: 5.2,
  rank: 1,
  burst: true,
  ...overrides,
});

describe('formatter', () => {
  describe('formatTable', () => {
    it('returns no repos message for empty array', () => {
      expect(formatTable([])).toBe('No repositories found.');
    });

    it('renders header and rows', () => {
      const repos = [makeScoredRepo({ full_name: 'a/b', stargazers_count: 50 })];
      const output = formatTable(repos);
      expect(output).toContain('#');
      expect(output).toContain('Name');
      expect(output).toContain('Stars');
      expect(output).toContain('a/b');
      expect(output).toContain('50');
    });
  });

  describe('formatJSON', () => {
    it('returns valid JSON', () => {
      const repos = [makeScoredRepo({ full_name: 'x/y' })];
      const output = formatJSON(repos);
      expect(() => JSON.parse(output)).not.toThrow();
    });

    it('includes rank and score fields', () => {
      const repos = [makeScoredRepo({ rank: 3, score: 12.345 })];
      const parsed = JSON.parse(formatJSON(repos));
      expect(parsed[0].rank).toBe(3);
      expect(parsed[0].score).toBe(12.35);
    });

    it('rounds velocity to 2 decimal places', () => {
      const repos = [makeScoredRepo({ velocity: 3.14159 })];
      const parsed = JSON.parse(formatJSON(repos));
      expect(parsed[0].velocity).toBe(3.14);
    });
  });
});
