import { DiscoverOptions, ScoredRepo } from '../types';
import { fetchTrendingRepos } from '../lib/github';
import { rankRepos } from '../lib/scorer';
import { formatTable, formatJSON } from '../lib/formatter';

export async function discoverCommand(options: DiscoverOptions): Promise<string> {
  const repos = await fetchTrendingRepos(options);
  const days = options.window === '24h' ? 1 : options.window === '7d' ? 7 : 30;
  const ranked: ScoredRepo[] = rankRepos(repos, days).slice(0, options.limit);

  if (options.json) {
    return formatJSON(ranked);
  }
  return formatTable(ranked);
}
