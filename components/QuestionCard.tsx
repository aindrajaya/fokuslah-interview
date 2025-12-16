import React, { useState } from 'react';
import MathRenderer from './MathRenderer';
import { BookOpen } from 'lucide-react';
import { QUESTION_DATA } from '../constants';

// Transform raw text to LaTeX format ONCE outside component
// This prevents recalculation on every render
const FORMATTED_TEXT = QUESTION_DATA.raw_text
  .replace("the number 0.00000000031", "$0.00000000031$")
  .replace("'plus-minus a times 10 to the power of n'", "$\\pm a \\times 10^n$")
  .replace("1 is less than or equal to a which is less than 10", "$1 \\leq |a| < 10$")
  .replace(" and n is", " and $n$ is");

const QuestionCard: React.FC = () => {
  console.log('🔵 QuestionCard rendered at', new Date().toISOString());
  const [answer, setAnswer] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 flex flex-col h-full overflow-y-auto">
      {/* Header Tags */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-600" />
          <span className="text-sm font-medium text-gray-600">Mathematics</span>
        </div>
        {QUESTION_DATA.difficulty && (
          <span className={`
            px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md
            ${QUESTION_DATA.difficulty === 'Easy' ? 'bg-green-50 text-green-700' : ''}
            ${QUESTION_DATA.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700' : ''}
            ${QUESTION_DATA.difficulty === 'Hard' ? 'bg-red-50 text-red-700' : ''}
          `}>
            {QUESTION_DATA.difficulty}
          </span>
        )}
        {QUESTION_DATA.topic && (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-md">
            {QUESTION_DATA.topic}
          </span>
        )}
      </div>

      {/* Question Body */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-serif text-gray-900 leading-relaxed">
          <MathRenderer text={FORMATTED_TEXT} />
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
          Question ID: <span className="font-mono text-gray-500">{QUESTION_DATA.id}</span>
        </div>
      </div>
    </div>
  );
};

QuestionCard.displayName = 'QuestionCard';

// Memoize with explicit comparison function that ALWAYS returns true (never re-render)
// This is for testing - if it still re-renders, React.memo is being bypassed somehow
const MemoizedQuestionCard = React.memo(QuestionCard, () => {
  console.log('🔴 QuestionCard memo comparison called - returning true (should NOT re-render)');
  return true; // Always return true = props are always equal = never re-render
});

export default MemoizedQuestionCard;
