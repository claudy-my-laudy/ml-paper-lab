import { Link } from 'react-router-dom';

export default function PaperCard({ paper }) {
  return (
    <Link to={`/papers/${paper.id}`} className="block group">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-full flex flex-col gap-3 hover:border-indigo-500 hover:bg-gray-800 transition-all duration-200">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-1 rounded">
            {paper.venue} {paper.year}
          </span>
        </div>
        <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
          {paper.title}
        </h2>
        <p className="text-sm text-gray-400 flex-1">{paper.description}</p>
        <p className="text-xs text-gray-500">{paper.authors}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {paper.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
