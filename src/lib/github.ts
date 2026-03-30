import axios from 'axios';
import { Repo, GitHubSearchResponse, DiscoverOptions } from '../types';
import { cache } from './cache';

const GITHUB_API = 'https://api.github.com';
const PER_PAGE = 100;
const MAX_PAGES = 5;

function buildSearchQuery(options: DiscoverOptions): string {
  const now = new Date();
  const windowDays = options.window === '24h' ? 1 : options.window === '7d' ? 7 : 30;
  const date = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
  const dateStr = date.toISOString().split('T')[0];

  let query = `created:>${dateStr} stars:>5`;
  if (options.lang) {
    query += ` language:${options.lang}`;
  }
  return query;
}

function windowToDays(window: '24h' | '7d' | '30d'): number {
  return window === '24h' ? 1 : window === '7d' ? 7 : 30;
}

export async function fetchTrendingRepos(options: DiscoverOptions): Promise<Repo[]> {
  const cacheKey = `github:search:${JSON.stringify(options)}`;
  const cached = options.cache ? cache.get<Repo[]>(cacheKey) : null;
  if (cached) return cached;

  const query = buildSearchQuery(options);
  const allRepos: Repo[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${GITHUB_API}/search/repositories`;
    const params = {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: PER_PAGE,
      page,
    };

    try {
      const response = await axios.get<GitHubSearchResponse>(url, {
        params,
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'findstars-cli',
        },
      });

      const items = response.data.items.map(item => ({
        name: item.name,
        full_name: item.full_name,
        description: item.description,
        stargazers_count: item.stargazers_count,
        language: item.language,
        html_url: item.html_url,
        created_at: item.created_at,
        topics: item.topics || [],
        pushed_at: item.pushed_at,
      }));

      allRepos.push(...items);

      if (items.length < PER_PAGE) break;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Use --no-cache to use cached data or wait an hour.');
      }
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        // Too many results, just return what we have
        break;
      }
      throw err;
    }
  }

  if (options.cache) {
    cache.set(cacheKey, allRepos);
  }

  return allRepos;
}
