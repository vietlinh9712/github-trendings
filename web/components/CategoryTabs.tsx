'use client';

import { useState, useEffect } from 'react';
import { RepoCard, ScoredRepo } from './RepoCard';
import { Loader2, Globe, Bot, Cpu, Wrench, Globe2, Smartphone, Shield, Database } from 'lucide-react';

const LANGUAGES = [
  { id: 'typescript', label: 'TypeScript', lang: 'TypeScript' },
  { id: 'python', label: 'Python', lang: 'Python' },
  { id: 'go', label: 'Go', lang: 'Go' },
  { id: 'rust', label: 'Rust', lang: 'Rust' },
] as const;

const TOPICS = [
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'machine-learning', label: 'ML/AI', icon: Cpu },
  { id: 'cli', label: 'CLI', icon: Wrench },
  { id: 'devtools', label: 'DevTools', icon: Wrench },
  { id: 'web', label: 'Web', icon: Globe2 },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data', icon: Database },
] as const;

interface CategoryState {
  repos: ScoredRepo[];
  loading: boolean;
  error: string | null;
}

export function CategoryTabs() {
  const [activeLang, setActiveLang] = useState<string>('typescript');
  const [activeTopic, setActiveTopic] = useState<string>('');
  const [states, setStates] = useState<Record<string, CategoryState>>({});

  const stateKey = `${activeLang}-${activeTopic}`;

  useEffect(() => {
    // Initialize all language+topic combinations as loading
    LANGUAGES.forEach(lang => {
      TOPICS.forEach(topic => {
        const key = `${lang.id}-${topic.id}`;
        if (!states[key]) {
          setStates(prev => ({ ...prev, [key]: { repos: [], loading: true, error: null } }));
          fetchRepos(key, lang.lang, topic.id);
        }
      });
      // Also fetch language-only
      const langKey = `${lang.id}-`;
      if (!states[langKey]) {
        setStates(prev => ({ ...prev, [langKey]: { repos: [], loading: true, error: null } }));
        fetchRepos(langKey, lang.lang, '');
      }
    });
  }, []);

  async function fetchRepos(key: string, lang: string, topic: string) {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null },
    }));

    try {
      const params = new URLSearchParams({ window: '7d', lang, limit: '10' });
      if (topic) params.set('topic', topic);
      const res = await fetch(`/api/discover?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }
      const repos: ScoredRepo[] = await res.json();
      setStates(prev => ({
        ...prev,
        [key]: { repos, loading: false, error: null },
      }));
    } catch (err) {
      setStates(prev => ({
        ...prev,
        [key]: {
          repos: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load',
        },
      }));
    }
  }

  function handleTopicChange(topicId: string) {
    const newTopic = activeTopic === topicId ? '' : topicId;
    setActiveTopic(newTopic);
    // Fetch if not yet cached
    const newKey = `${activeLang}-${newTopic}`;
    if (!states[newKey]) {
      const lang = LANGUAGES.find(l => l.id === activeLang)!;
      setStates(prev => ({ ...prev, [newKey]: { repos: [], loading: true, error: null } }));
      fetchRepos(newKey, lang.lang, newTopic);
    }
  }

  function handleLangChange(langId: string) {
    setActiveLang(langId);
    setActiveTopic('');
    const newKey = `${langId}-`;
    if (!states[newKey]) {
      const lang = LANGUAGES.find(l => l.id === langId)!;
      setStates(prev => ({ ...prev, [newKey]: { repos: [], loading: true, error: null } }));
      fetchRepos(newKey, lang.lang, '');
    }
  }

  const current = states[stateKey] || { repos: [], loading: true, error: null };

  return (
    <div>
      {/* Language Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            onClick={() => handleLangChange(lang.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeLang === lang.id && !activeTopic
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            {lang.label}
          </button>
        ))}
      </div>

      {/* Topic Chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TOPICS.map(topic => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicChange(topic.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTopic === topic.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {topic.label}
            </button>
          );
        })}
        {activeTopic && (
          <button
            onClick={() => setActiveTopic('')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-all"
          >
            ✕ Clear topic
          </button>
        )}
      </div>

      {/* Loading */}
      {current.loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-slate-500">Loading...</span>
        </div>
      )}

      {/* Error */}
      {current.error && (
        <div className="text-center py-12 text-red-500">
          <p>{current.error}</p>
          <button
            onClick={() => {
              const lang = LANGUAGES.find(l => l.id === activeLang)!;
              fetchRepos(stateKey, lang.lang, activeTopic);
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {!current.loading && !current.error && current.repos.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No repositories found.</p>
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
