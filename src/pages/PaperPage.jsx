import { useParams } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { papers } from '../papers/index.js';
import PaperLayout from '../components/PaperLayout.jsx';

export default function PaperPage() {
  const { id } = useParams();
  const paper = papers.find(p => p.id === id);

  if (!paper) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-400">Paper not found.</p>
        </div>
      </div>
    );
  }

  const DemoComponent = lazy(paper.component);

  return (
    <PaperLayout paper={paper}>
      <Suspense fallback={
        <div className="flex items-center justify-center py-20 text-gray-500">
          Loading demo...
        </div>
      }>
        <DemoComponent />
      </Suspense>
    </PaperLayout>
  );
}
