import React, { useMemo } from 'react';
import { Message, MessageSender } from '../types';
import MathRenderer from './MathRenderer';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  // Memoize timestamp formatting (avoid re-computing on every render)
  const formattedTime = useMemo(() => 
    message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [message.timestamp]
  );

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0">
          <Bot size={18} className="text-indigo-600" />
        </div>
      )}

      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <MathRenderer text={message.text} />
        <div className={`text-[10px] mt-1 ${isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
          {formattedTime}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
          <User size={18} className="text-gray-600" />
        </div>
      )}
    </div>
  );
};

// Memoize to prevent re-renders when message hasn't changed
export default React.memo(ChatMessage);
