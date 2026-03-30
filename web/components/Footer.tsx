export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          Built with{' '}
          <a
            href="https://github.com/vietlinh9712/github-trendings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            github-trendings
          </a>
          {' '}— MIT License
        </p>
      </div>
    </footer>
  );
}
