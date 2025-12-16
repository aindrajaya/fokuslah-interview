import React from 'react';
import { QuestionData } from '../types';
import MathRenderer from './MathRenderer';
import { BookOpen } from 'lucide-react';

interface QuestionCardProps {
  data: QuestionData;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ data }) => {
  // Hardcoded replacement logic as per requirement:
  // "You do NOT need to build a smart parser. Basic string replacements are enough."
  
  // Requirement mapping:
  // "10 to the power of n" -> "10^n"
  // "plus-minus a times 10 to the power of n" -> "\pm a \times 10^n"
  // "less than or equal to" -> "\le" (or \leq)
  
  // NOTE: In a real app, I'd use a regex map, but the prompt explicitly gave the output.
  // Expected: "Convert $0.00000000031$ to the form $\pm a \times 10^n$, where $1 \le a < 10$ and $n$ is an integer."
  // Note: The prompt's example raw text was: "Convert the number 0.00000000031 to the form 'plus-minus a times 10 to the power of n'..."
  
  const beautifyText = (raw: string): string => {
    // We are reconstructing the specific question for the "Textbook Quality" look.
    // 1. Convert the main number
    let clean = raw.replace("Convert the number 0.00000000031", "Convert $0.00000000031$");
    
    // 2. Convert the scientific notation definition
    clean = clean.replace(
      "'plus-minus a times 10 to the power of n'",
      "$\\pm a \\times 10^n$"
    );
    
    // 3. Convert the inequality
    clean = clean.replace(
      "where 1 is less than or equal to a which is less than 10",
      "where $1 \\le a < 10$"
    );
    
    // 4. Convert the variable definition
    clean = clean.replace("and n is an integer.", "and $n$ is an integer.");

    return clean;
  };

  const processedText = beautifyText(data.raw_text);

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 flex flex-col h-full overflow-y-auto">
      {/* Header Tags */}
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-md">
          {data.topic}
        </span>
        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-md">
          {data.difficulty}
        </span>
      </div>

      {/* Question Body */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg mt-1 hidden sm:block">
            <BookOpen size={24} className="text-gray-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif text-gray-900 leading-relaxed">
              <MathRenderer text={processedText} />
            </h1>
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer
        </label>
        <div className="relative max-w-md">
          <input 
            type="text" 
            placeholder="e.g. 3.1 x 10^-10"
            className="w-full text-lg p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors font-mono text-gray-800 placeholder-gray-400"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
             Standard Form
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Press Enter to submit (Simulation only)
        </p>
      </div>

      <div className="mt-auto pt-10 text-center md:text-left">
          <div className="text-sm text-gray-400">
            Question ID: <span className="font-mono text-gray-500">{data.id}</span>
          </div>
      </div>
    </div>
  );
};

export default QuestionCard;
