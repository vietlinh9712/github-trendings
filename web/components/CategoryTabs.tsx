'use client';

import { useState, useEffect } from 'react';
import { RepoCard, ScoredRepo } from './RepoCard';
import { Loader2, Globe } from 'lucide-react';

const CATEGORIES = [
  { id: 'typescript', label: 'TypeScript', lang: 'TypeScript' },
  { id: 'python', label: 'Python', lang: 'Python' },
  { id: 'go', label: 'Go', lang: 'Go' },
  { id: 'rust', label: 'Rust', lang: 'Rust' },
] as const;

interface CategoryState {
  repos: ScoredRepo[];
  loading: boolean;
  error: string | null;
}

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState<string>('typescript');
  const [states, setStates] = useState<Record<string, CategoryState>>(
    Object.fromEntries(CATEGORIES.map(c => [c.id, { repos: [], loading: true, error: null }]))
  );

  useEffect(() => {
    CATEGORIES.forEach(cat => {
      if (states[cat.id].repos.length === 0 && states[cat.id].loading) {
        fetchRepos(cat.id, cat.lang);
      }
    });
  }, []);

  async function fetchRepos(categoryId: string, lang: string) {
    setStates(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], loading: true, error: null },
    }));

    try {
      const qs = new URLSearchParams({ window: '7d', lang, limit: '10' });
      const res = await fetch(`/api/discover?${qs}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }
      const repos: ScoredRepo[] = await res.json();
      setStates(prev => ({
        ...prev,
        [categoryId]: { repos, loading: false, error: null },
      }));
    } catch (err) {
      setStates(prev => ({
        ...prev,
        [categoryId]: {
          repos: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load',
        },
      }));
    }
  }

  const current = states[activeCategory];

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {current.loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-slate-500">Loading {activeCategory} repos...</span>
        </div>
      )}

      {current.error && (
        <div className="text-center py-12 text-red-500">
          <p>{current.error}</p>
          <button
            onClick={() => {
              const cat = CATEGORIES.find(c => c.id === activeCategory)!;
              fetchRepos(activeCategory, cat.lang);
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!current.loading && !current.error && current.repos.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No repositories found for {activeCategory}.</p>
        </div>
      )}

      {!current.loading && !current.error && current.repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {current.repos.map(repo => (
            <RepoCard key={repo.full_name} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
