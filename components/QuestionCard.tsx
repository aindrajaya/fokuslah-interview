import React, { useState } from 'react';
import MathRenderer from './MathRenderer';
import { BookOpen } from 'lucide-react';
import { SAMPLE_QUESTION } from '../constants';

const QuestionCard: React.FC = () => {
  const [answer, setAnswer] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 flex flex-col h-full overflow-y-auto">
      {/* Header Tags */}
      <div className="flex items-center gap-3 mb-6">
        {SAMPLE_QUESTION.subject && (
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">{SAMPLE_QUESTION.subject}</span>
          </div>
        )}
        {SAMPLE_QUESTION.difficulty && (
          <span className={`
            px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md
            ${SAMPLE_QUESTION.difficulty === 'Easy' ? 'bg-green-50 text-green-700' : ''}
            ${SAMPLE_QUESTION.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700' : ''}
            ${SAMPLE_QUESTION.difficulty === 'Hard' ? 'bg-red-50 text-red-700' : ''}
          `}>
            {SAMPLE_QUESTION.difficulty}
          </span>
        )}
        {SAMPLE_QUESTION.topic && (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-md">
            {SAMPLE_QUESTION.topic}
          </span>
        )}
      </div>

      {/* Question Body */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-serif text-gray-900 leading-relaxed">
          <MathRenderer text={SAMPLE_QUESTION.text} />
        </h1>
      </div>

      {/* Answer Section */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer
        </label>
        <div className="relative max-w-md">
          <input 
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer (e.g., 3.1 × 10^-10)..."
            className="
              w-full text-lg p-4 border-2 border-gray-200 rounded-xl 
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none
              transition-all duration-200
              hover:border-gray-300
              placeholder:text-gray-400
            "
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Tip: You can use ^ for exponents or write in LaTeX format
        </p>
      </div>

      <div className="mt-auto pt-10 text-center md:text-left">
        <div className="text-sm text-gray-400">
          Question ID: <span className="font-mono text-gray-500">{SAMPLE_QUESTION.id}</span>
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when parent state changes
export default React.memo(QuestionCard);
