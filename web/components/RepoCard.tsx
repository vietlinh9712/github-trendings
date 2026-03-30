import { Star, TrendingUp, Calendar, Zap } from 'lucide-react';

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

export function RepoCard({ repo }: { repo: ScoredRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
            #{repo.rank}
          </span>
          <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {repo.full_name}
          </h3>
        </div>
        {repo.burst && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium">
            <Zap className="w-3 h-3" />
            Rising
          </span>
        )}
      </div>

      {repo.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{formatNumber(repo.stargazers_count)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="font-medium">{repo.velocity.toFixed(1)}/day</span>
        </div>

        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">{repo.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>{timeAgo(repo.created_at)}</span>
        </div>
      </div>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {repo.topics.slice(0, 5).map(topic => (
            <span
              key={topic}
              className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
