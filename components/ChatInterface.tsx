import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Eye, X } from 'lucide-react';
import { Message, MessageSender } from '../types';
import { QUESTION_DATA } from '../constants';
import ChatMessage from './ChatMessage';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm Jojo. I'm here to help you with this question. Stuck? Ask for a hint!",
      sender: MessageSender.AI,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (text: string, sender: MessageSender) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    // 1. Add User Message
    addMessage(text, MessageSender.USER);
    setInputText('');
    setIsTyping(true);

    // 2. Simulate AI response with mock data (1.5 second delay)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerText = text.toLowerCase();
    let aiResponseText = '';

    // Mock response logic based on common queries
    if (lowerText.includes('hint') || lowerText.includes('help')) {
      aiResponseText = "Great question! Let's break this down. For this logarithm equation, remember that $\\log_a(b) = c$ means $a^c = b$. Try converting the equation to exponential form first. What would that look like?";
    } else if (lowerText.includes('step') || lowerText.includes('reveal') || lowerText.includes('solution')) {
      aiResponseText = "Alright! Here are the steps:\n\n1. Convert to exponential form: $2^{x+1} = 32$\n2. Recognize that $32 = 2^5$\n3. So: $2^{x+1} = 2^5$\n4. Since the bases are equal: $x + 1 = 5$\n5. Solve: $x = 4$\n\nThe answer is $x = 4$. Does that make sense?";
    } else if (lowerText.includes('check') || lowerText.includes('correct') || lowerText.includes('right')) {
      aiResponseText = "Let's verify! If $x = 4$, then $\\log_2(2^{4+1}) = \\log_2(2^5) = \\log_2(32) = 5$. That's correct! 🎉";
    } else if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('how')) {
      aiResponseText = "A good starting point is to recall the relationship between logarithms and exponents. What does $\\log_2(2^{x+1})$ simplify to?";
    } else {
      aiResponseText = "That's an interesting approach! Remember, we're solving $\\log_2(2^{x+1}) = 5$. What property of logarithms could help simplify the left side?";
    }

    setIsTyping(false);
    addMessage(aiResponseText, MessageSender.AI);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  // Styles for Slide-over (Mobile) vs Static Split (Desktop)
  const mobileClasses = `fixed inset-y-0 right-0 w-full z-50 bg-gray-50 transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`;
  
  const desktopClasses = "h-full flex flex-col bg-gray-50 border-l border-gray-200";

  return (
    <div className={isMobile ? mobileClasses : desktopClasses}>
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
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
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-hide">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none text-gray-500 text-sm shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => handleSendMessage("Give me a hint")}
          className="flex-shrink-0 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-medium rounded-full transition-colors flex items-center gap-1"
        >
          <Sparkles size={12} /> Give me a hint
        </button>
        <button 
           onClick={() => handleSendMessage("Reveal the steps")}
           className="flex-shrink-0 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-medium rounded-full transition-colors flex items-center gap-1"
        >
          <Eye size={12} /> Reveal the steps
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-gray-100 text-gray-800 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          <button
            onClick={() => handleSendMessage()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;