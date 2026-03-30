"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverCommand = discoverCommand;
const github_1 = require("../lib/github");
const scorer_1 = require("../lib/scorer");
const formatter_1 = require("../lib/formatter");
async function discoverCommand(options) {
    const repos = await (0, github_1.fetchTrendingRepos)(options);
    const days = options.window === '24h' ? 1 : options.window === '7d' ? 7 : 30;
    const ranked = (0, scorer_1.rankRepos)(repos, days).slice(0, options.limit);
    if (options.json) {
        return (0, formatter_1.formatJSON)(ranked);
    }
    return (0, formatter_1.formatTable)(ranked);
}
//# sourceMappingURL=discover.js.map