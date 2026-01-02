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

// Convert scientific notation to LaTeX format
const convertToLatex = (input: string): string => {
  if (!input.trim()) return '';
  
  // Pattern to match scientific notation: number × 10^exponent or number x 10^exponent
  // Handles: 3.1 × 10^-10, 3.1 x 10^2, 3.1*10^-10, 3.1 × 10^{-10}, etc.
  const scientificPattern = /(-?\d+\.?\d*)\s*[×x*]\s*10\^?\{?(-?\d+)\}?/gi;
  
  let result = input.replace(scientificPattern, (match, coefficient, exponent) => {
    return `${coefficient} \\times 10^{${exponent}}`;
  });
  
  // If no scientific notation was found, check if there are standalone ^ notations
  if (result === input && /\^/.test(input)) {
    // Convert simple exponents like x^2 to x^{2}
    result = input.replace(/\^(-?\d+)/g, '^{$1}');
  }
  
  return result;
};

const QuestionCard: React.FC = () => {
  console.log('🔵 QuestionCard rendered at', new Date().toISOString());
  const [answer, setAnswer] = useState('');
  const [formattedAnswer, setFormattedAnswer] = useState('');

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    setFormattedAnswer(convertToLatex(value));
  };

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
            onChange={handleAnswerChange}
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
        
        {/* Math Preview */}
        {formattedAnswer && (
          <div className="mt-3 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <p className="text-xs font-medium text-indigo-700 mb-1">Preview:</p>
            <div className="text-xl">
              <MathRenderer text={`$${formattedAnswer}$`} />
            </div>
          </div>
        )}
        
        <p className="mt-2 text-xs text-gray-500">
          Tip: Use × or x with 10^ for scientific notation (e.g., 3.1 × 10^-10)
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
