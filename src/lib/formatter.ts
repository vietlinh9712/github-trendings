import { ScoredRepo } from '../types';

export function formatTable(repos: ScoredRepo[]): string {
  if (repos.length === 0) return 'No repositories found.';

  const colWidths = {
    rank: 5,
    name: 30,
    stars: 7,
    vel: 8,
    lang: 10,
  };

  const header = [
    '#'.padEnd(colWidths.rank),
    'Name'.padEnd(colWidths.name),
    'Stars'.padEnd(colWidths.stars),
    'Veloc'.padEnd(colWidths.vel),
    'Lang'.padEnd(colWidths.lang),
    'Description',
  ].join('  ');

  const sep = '-'.repeat(header.length);

  const rows = repos.map(repo => {
    const desc = (repo.description || '—').substring(0, 50).padEnd(50);
    return [
      String(repo.rank).padEnd(colWidths.rank),
      repo.full_name.substring(0, colWidths.name).padEnd(colWidths.name),
      repo.stargazers_count.toString().padEnd(colWidths.stars),
      repo.velocity.toFixed(1).padEnd(colWidths.vel),
      (repo.language || '—').substring(0, colWidths.lang).padEnd(colWidths.lang),
      desc,
    ].join('  ');
  });

  return [header, sep, ...rows].join('\n');
}

export function formatJSON(repos: ScoredRepo[]): string {
  return JSON.stringify(
    repos.map(({ score, velocity, rank, burst, ...repo }) => ({
      ...repo,
      score: Math.round(score * 100) / 100,
      velocity: Math.round(velocity * 100) / 100,
      rank,
      burst,
    })),
    null,
    2
  );
}
