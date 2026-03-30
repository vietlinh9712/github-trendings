'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: { window: string; lang: string; limit: number }) => void;
  loading: boolean;
  initialValues?: { window: string; lang: string; limit: number };
}

const WINDOWS = ['24h', '7d', '30d'] as const;
const LIMITS = [10, 20, 50, 100] as const;

export function SearchForm({ onSearch, loading, initialValues }: SearchFormProps) {
  const [window, setWindow] = useState(initialValues?.window || '7d');
  const [lang, setLang] = useState(initialValues?.lang || '');
  const [limit, setLimit] = useState(initialValues?.limit || 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ window, lang, limit });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
      {/* Time Window */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Time Window
        </label>
        <div className="flex gap-2">
          {WINDOWS.map(w => (
            <button
              key={w}
              type="button"
              onClick={() => setWindow(w)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                window === w
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Language + Limit Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Language
          </label>
          <input
            type="text"
            value={lang}
            onChange={e => setLang(e.target.value)}
            placeholder="e.g. TypeScript, Python, Go..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Results
          </label>
          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LIMITS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Discover Repos
          </>
        )}
      </button>
    </form>
  );
}
