"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const discover_1 = require("./commands/discover");
const cache_1 = require("./lib/cache");
const program = new commander_1.Command();
program
    .name('findstars')
    .description('Discover emerging GitHub repositories with rising star velocity')
    .version('0.1.0');
program
    .command('discover')
    .description('Find rising-star GitHub repositories')
    .option('-w, --window <window>', 'Time window: 24h, 7d, or 30d', '7d')
    .option('-l, --lang <lang>', 'Filter by programming language (e.g. TypeScript, Python, Go)')
    .option('-n, --limit <n>', 'Number of results to show', '20')
    .option('--json', 'Output as JSON', false)
    .option('--no-cache', 'Disable caching')
    .action(async (options) => {
    const opts = {
        window: options.window,
        lang: options.lang,
        limit: parseInt(options.limit, 10) || 20,
        json: options.json,
        cache: options.cache !== false,
    };
    try {
        const output = await (0, discover_1.discoverCommand)(opts);
        console.log(output);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
        }
        throw err;
    }
});
program
    .command('cache')
    .description('Manage cache')
    .option('--clear', 'Clear all cached data')
    .option('--stats', 'Show cache statistics')
    .action((options) => {
    if (options.clear) {
        cache_1.cache.clear();
        console.log('Cache cleared.');
    }
    else if (options.stats) {
        const stats = cache_1.cache.stats();
        console.log(`Cache stats: ${stats.hits} hits, ${stats.misses} misses, ${stats.size} entries`);
    }
});
program.parse();
//# sourceMappingURL=cli.js.map