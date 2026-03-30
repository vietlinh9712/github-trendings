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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        {/* Language input */}
        <input
          type="text"
          value={lang}
          onChange={e => setLang(e.target.value)}
          placeholder="Language (e.g. TypeScript, Python, Go...)"
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/10 backdrop-blur text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
        />

        {/* Window + Limit row */}
        <div className="flex gap-2">
          <div className="flex gap-1 bg-white/10 rounded-xl p-1">
            {WINDOWS.map(w => (
              <button
                key={w}
                type="button"
                onClick={() => setWindow(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  window === w
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/10 text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {LIMITS.map(l => (
              <option key={l} value={l} className="bg-slate-800">{l}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Discover
            </>
          )}
        </button>
      </div>
    </form>
  );
}
