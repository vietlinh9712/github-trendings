'use client';

import { Star } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            GitHub Trendings
          </h1>
        </div>
        <a
          href="https://github.com/vietlinh9712/github-trendings"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </header>
  );
}
