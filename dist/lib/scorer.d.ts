import { Repo, ScoredRepo } from '../types';
export declare function daysSince(dateStr: string): number;
export declare function calculateVelocity(repo: Repo, windowDays: number): number;
export declare function calculateScore(repo: Repo, windowDays: number): number;
export declare function detectBurst(repo: Repo, starsPerDay: number, windowDays: number): boolean;
export declare function rankRepos(repos: Repo[], windowDays: number): ScoredRepo[];
//# sourceMappingURL=scorer.d.ts.map