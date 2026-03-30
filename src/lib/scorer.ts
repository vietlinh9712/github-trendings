import { Repo, ScoredRepo } from '../types';

export function daysSince(dateStr: string): number {
  const created = new Date(dateStr);
  const now = new Date();
  return Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
}

export function calculateVelocity(repo: Repo, windowDays: number): number {
  return repo.stargazers_count / daysSince(repo.created_at);
}

export function calculateScore(repo: Repo, windowDays: number): number {
  const velocity = calculateVelocity(repo, windowDays);
  return velocity * Math.log(repo.stargazers_count + 1);
}

export function detectBurst(repo: Repo, starsPerDay: number, windowDays: number): boolean {
  // If the repo gained significant stars recently relative to its age
  // Conservative: flag if it has >20 stars and is <30 days old
  return repo.stargazers_count > 20 && daysSince(repo.created_at) < 30;
}

export function rankRepos(repos: Repo[], windowDays: number): ScoredRepo[] {
  const scored = repos.map(repo => {
    const velocity = calculateVelocity(repo, windowDays);
    const score = calculateScore(repo, windowDays);
    const burst = detectBurst(repo, velocity, windowDays);
    return { ...repo, score, velocity, rank: 0, burst };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.map((repo, index) => ({ ...repo, rank: index + 1 }));
}
