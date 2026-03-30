"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daysSince = daysSince;
exports.calculateVelocity = calculateVelocity;
exports.calculateScore = calculateScore;
exports.detectBurst = detectBurst;
exports.rankRepos = rankRepos;
function daysSince(dateStr) {
    const created = new Date(dateStr);
    const now = new Date();
    return Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
}
function calculateVelocity(repo, windowDays) {
    return repo.stargazers_count / daysSince(repo.created_at);
}
function calculateScore(repo, windowDays) {
    const velocity = calculateVelocity(repo, windowDays);
    return velocity * Math.log(repo.stargazers_count + 1);
}
function detectBurst(repo, starsPerDay, windowDays) {
    // If the repo gained significant stars recently relative to its age
    // Conservative: flag if it has >20 stars and is <30 days old
    return repo.stargazers_count > 20 && daysSince(repo.created_at) < 30;
}
function rankRepos(repos, windowDays) {
    const scored = repos.map(repo => {
        const velocity = calculateVelocity(repo, windowDays);
        const score = calculateScore(repo, windowDays);
        const burst = detectBurst(repo, velocity, windowDays);
        return { ...repo, score, velocity, rank: 0, burst };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.map((repo, index) => ({ ...repo, rank: index + 1 }));
}
//# sourceMappingURL=scorer.js.map