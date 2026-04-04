import { Link } from 'react-router-dom';

export default function PaperLayout({ paper, children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-8 transition-colors">
          ← Back to papers
        </Link>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-1 rounded">
              {paper.venue} {paper.year}
            </span>
            {paper.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{paper.title}</h1>
          <p className="text-gray-400">{paper.authors}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
