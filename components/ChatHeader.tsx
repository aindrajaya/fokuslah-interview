import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface ChatHeaderProps {
  isMobile: boolean;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isMobile, onClose }) => {
  return (
    <div className="flex-shrink-0 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Ask Jojo</h3>
          <span className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
      
      {/* Mobile Close Button */}
      {isMobile && (
        <button 
          onClick={onClose} 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close chat"
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
};

// Memoize to prevent re-renders when messages change
export default React.memo(ChatHeader);
