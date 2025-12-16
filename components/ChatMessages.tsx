import React from 'react';
import { MessageCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Message } from '../types';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-hide min-h-0 max-h-full" 
      style={{ overscrollBehavior: 'contain' }}
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none text-gray-500 text-sm shadow-sm flex items-center gap-2">
            <span className="text-gray-600">Thinking</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Only re-render when messages or isTyping changes
export default React.memo(ChatMessages);
