import { describe, it, expect } from 'vitest';
import { daysSince, calculateVelocity, calculateScore, detectBurst, rankRepos } from '../src/lib/scorer';
import { Repo } from '../src/types';

const makeRepo = (overrides: Partial<Repo> = {}): Repo => ({
  name: 'test-repo',
  full_name: 'test/test-repo',
  description: 'A test repo',
  stargazers_count: 100,
  language: 'TypeScript',
  html_url: 'https://github.com/test/test-repo',
  created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  topics: [],
  pushed_at: new Date().toISOString(),
  ...overrides,
});

describe('scorer', () => {
  describe('daysSince', () => {
    it('returns minimum 1 for dates in the future', () => {
      const future = new Date(Date.now() + 1000).toISOString();
      expect(daysSince(future)).toBe(1);
    });

    it('returns correct days for a date 10 days ago', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      expect(daysSince(tenDaysAgo)).toBe(10);
    });
  });

  describe('calculateVelocity', () => {
    it('calculates correct stars per day', () => {
      const repo = makeRepo({ stargazers_count: 100, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() });
      expect(calculateVelocity(repo, 10)).toBe(10);
    });

    it('caps at minimum 1 day', () => {
      const repo = makeRepo({ stargazers_count: 50, created_at: new Date().toISOString() }); // today
      expect(calculateVelocity(repo, 1)).toBe(50);
    });
  });

  describe('calculateScore', () => {
    it('factors in velocity and log of total stars', () => {
      const repo = makeRepo({ stargazers_count: 100, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() });
      const score = calculateScore(repo, 10);
      // velocity = 10, log(101) ≈ 4.615, score ≈ 46.15
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('detectBurst', () => {
    it('flags young repos with significant stars', () => {
      const repo = makeRepo({ stargazers_count: 50, created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() });
      expect(detectBurst(repo, 3, 7)).toBe(true);
    });

    it('does not flag old repos', () => {
      const repo = makeRepo({ stargazers_count: 50, created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() });
      expect(detectBurst(repo, 1, 30)).toBe(false);
    });
  });

  describe('rankRepos', () => {
    it('ranks repos by score descending', () => {
      const repos = [
        makeRepo({ full_name: 'a/a', stargazers_count: 50, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }),
        makeRepo({ full_name: 'b/b', stargazers_count: 500, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }),
        makeRepo({ full_name: 'c/c', stargazers_count: 200, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }),
      ];
      const ranked = rankRepos(repos, 10);
      expect(ranked[0].full_name).toBe('b/b'); // highest stars
      expect(ranked[1].full_name).toBe('c/c'); // high velocity (newer)
      expect(ranked[2].full_name).toBe('a/a');
    });

    it('assigns correct sequential ranks', () => {
      const repos = [
        makeRepo({ full_name: 'x/x', stargazers_count: 100 }),
        makeRepo({ full_name: 'y/y', stargazers_count: 200 }),
      ];
      const ranked = rankRepos(repos, 10);
      expect(ranked[0].rank).toBe(1);
      expect(ranked[1].rank).toBe(2);
    });
  });
});
