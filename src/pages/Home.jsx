import { useState } from 'react';
import { papers } from '../papers/index.js';
import PaperCard from '../components/PaperCard.jsx';

const allTags = [...new Set(papers.flatMap(p => p.tags))];

export default function Home() {
  const [activeTag, setActiveTag] = useState(null);

  const filtered = activeTag ? papers.filter(p => p.tags.includes(activeTag)) : papers;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            ML Paper Lab
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl">
            Interactive showcases for landmark machine learning papers. Live demos, visualizations, and plain-language explanations.
          </p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              !activeTag
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                activeTag === tag
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No papers found for this tag.
          </div>
        )}

        <footer className="mt-20 text-center text-gray-600 text-sm">
          ML Paper Lab — interactive demos for landmark ML research
        </footer>
      </div>
    </div>
  );
}
