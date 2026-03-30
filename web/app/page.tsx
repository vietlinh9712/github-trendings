'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchForm } from '@/components/SearchForm';
import { CategoryTabs } from '@/components/CategoryTabs';
import { RepoCard, ScoredRepo } from '@/components/RepoCard';
import { AlertCircle, Search, Sparkles, Zap, TrendingUp } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const [repos, setRepos] = useState<ScoredRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const initialWindow = searchParams.get('window') || '7d';
  const initialLang = searchParams.get('lang') || '';
  const initialLimit = parseInt(searchParams.get('limit') || '20');

  useEffect(() => {
    if (searchParams.toString()) {
      doSearch({ window: initialWindow, lang: initialLang, limit: initialLimit });
      setShowSearch(true);
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
      setShowSearch(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9Im5vbmUiIHJvdGF0ZT0iNDUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwIi8+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Discover before it trends
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Trendings</span>
              </h1>
              <p className="text-lg text-slate-300 mb-6 max-w-lg">
                Find emerging open-source repositories with rising star velocity. Discover the next breakout project before it hits mainstream.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-400" /> Star velocity scoring
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-400" /> 4 languages tracked
                </span>
                <span className="flex items-center gap-1">
                  <Search className="w-4 h-4 text-blue-400" /> Free, no token needed
                </span>
              </div>
            </div>
            <div className="w-full md:w-auto md:min-w-80">
              <SearchForm
                onSearch={doSearch}
                loading={loading}
                initialValues={{ window: initialWindow, lang: initialLang, limit: initialLimit }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs — auto-loaded */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {!showSearch && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Trending by Category
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Top rising repositories for each language — updated automatically
            </p>
          </div>
        )}

        {!showSearch && <CategoryTabs />}

        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading && showSearch && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-500">Searching GitHub...</span>
            </div>
          </div>
        )}

        {!loading && showSearch && repos.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Search Results
              </h2>
              <button
                onClick={() => setShowSearch(false)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to categories
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map(repo => (
                <RepoCard key={repo.full_name} repo={repo} />
              ))}
            </div>
          </>
        )}

        {!loading && showSearch && repos.length === 0 && !error && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No results found
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Try different filters or check back later
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500">Loading...</span>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
