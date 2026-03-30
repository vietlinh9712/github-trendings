import { Star, TrendingUp, Calendar, Zap, ExternalLink } from 'lucide-react';

export interface ScoredRepo {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  created_at: string;
  topics: string[];
  pushed_at: string;
  score: number;
  velocity: number;
  rank: number;
  burst: boolean;
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  return `${Math.floor(months / 12)} years ago`;
}

// GitHub language colors
const LANG_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-400',
  Python: 'bg-yellow-400',
  JavaScript: 'bg-yellow-500',
  Go: 'bg-cyan-400',
  Rust: 'bg-orange-400',
  Java: 'bg-red-400',
  'C++': 'bg-purple-400',
  C: 'bg-gray-400',
  Ruby: 'bg-red-500',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-500',
  Dart: 'bg-cyan-500',
  PHP: 'bg-indigo-400',
  Scala: 'bg-red-600',
  Shell: 'bg-green-500',
};

export function RepoCard({ repo }: { repo: ScoredRepo }) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] || 'bg-slate-400') : 'bg-slate-400';

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
    >
      {/* Burst badge */}
      {repo.burst && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg">
          <Zap className="w-3 h-3" />
          Rising
        </div>
      )}

      {/* Rank + Name */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-sm font-black text-slate-500 dark:text-slate-400">
          #{repo.rank}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base">
            {repo.full_name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <ExternalLink className="w-3 h-3" />
            Open on GitHub
          </div>
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {repo.description}
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-1.5" title="Stars">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {formatNumber(repo.stargazers_count)}
          </span>
        </div>
        <div className="flex items-center gap-1.5" title="Daily velocity">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {repo.velocity.toFixed(1)}/day
          </span>
        </div>
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${langColor}`} />
            <span className="text-sm text-slate-600 dark:text-slate-400">{repo.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 ml-auto" title="Created">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">{timeAgo(repo.created_at)}</span>
        </div>
      </div>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map(topic => (
            <span
              key={topic}
              className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
