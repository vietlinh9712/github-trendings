'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchForm } from '@/components/SearchForm';
import { RepoCard, ScoredRepo } from '@/components/RepoCard';
import { AlertCircle, Search } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const [repos, setRepos] = useState<ScoredRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialWindow = searchParams.get('window') || '7d';
  const initialLang = searchParams.get('lang') || '';
  const initialLimit = parseInt(searchParams.get('limit') || '20');

  useEffect(() => {
    if (searchParams.toString()) {
      doSearch({ window: initialWindow, lang: initialLang, limit: initialLimit });
    }
  }, []);

  async function doSearch(params: { window: string; lang: string; limit: number }) {
    setLoading(true);
    setError(null);
    setRepos([]);

    try {
      const qs = new URLSearchParams({
        window: params.window,
        lang: params.lang,
        limit: String(params.limit),
      });
      const res = await fetch(`/api/discover?${qs}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Error ${res.status}`);
      }
      const data: ScoredRepo[] = await res.json();
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Discover Rising Stars
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Find emerging GitHub repositories with rising star velocity
          </p>
        </div>

        <SearchForm
          onSearch={doSearch}
          loading={loading}
          initialValues={{ window: initialWindow, lang: initialLang, limit: initialLimit }}
        />

        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30 animate-pulse" />
            <p>Searching GitHub...</p>
          </div>
        )}

        {!loading && repos.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {repos.length} repositories found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map(repo => (
                <RepoCard key={repo.full_name} repo={repo} />
              ))}
            </div>
          </>
        )}

        {!loading && repos.length === 0 && !error && !searchParams.toString() && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Ready to discover
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Set your filters above and click Discover to find rising GitHub repos
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-500">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
