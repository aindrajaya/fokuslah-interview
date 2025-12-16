import React from 'react';
import { Send, Sparkles, Eye } from 'lucide-react';

interface ChatInputProps {
  inputText: string;
  isTyping: boolean;
  showQuickActions: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (text: string) => void;
  onSend: (text?: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  isTyping,
  showQuickActions,
  inputRef,
  onInputChange,
  onSend,
  onKeyPress,
}) => {
  return (
    <>
      {/* Suggested Actions */}
      {showQuickActions && (
        <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => onSend("Give me a hint")}
              className="flex-shrink-0 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-medium rounded-full transition-colors flex items-center gap-1"
            >
              <Sparkles size={12} /> Give me a hint
            </button>
            <button 
              onClick={() => onSend("Reveal the steps")}
              className="flex-shrink-0 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-medium rounded-full transition-colors flex items-center gap-1"
            >
              <Eye size={12} /> Reveal the steps
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="Type a message..."
            disabled={isTyping}
            className="w-full bg-gray-100 text-gray-800 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={() => onSend()}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

// Memoize to prevent re-renders when messages array changes
export default React.memo(ChatInput);
