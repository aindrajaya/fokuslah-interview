import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, MessageSender } from '../types';
import { getAIResponse } from '../constants';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm Jojo, your math tutor. Feel free to ask me for hints, step-by-step solutions, or clarifications about the problem!",
      sender: MessageSender.AI,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use ref to store current input text to avoid recreating callbacks
  const inputTextRef = useRef('');
  
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Scroll with a slight delay to ensure DOM is updated
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens on mobile
  useEffect(() => {
    if (isOpen && isMobile && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMobile]);

  // Memoize addMessage to prevent recreating on every render
  const addMessage = useCallback((text: string, sender: MessageSender) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  // Use ref to access current inputText without adding it to dependencies
  const handleSendMessage = useCallback(async (text?: string) => {
    const messageText = text !== undefined ? text : inputTextRef.current;
    
    if (!messageText.trim()) return;

    // 1. Add User Message
    addMessage(messageText, MessageSender.USER);
    setInputText('');
    setIsTyping(true);

    // 2. Simulate thinking delay (~1.5 seconds) and get smart response
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      setIsTyping(false);
      addMessage(aiResponse, MessageSender.AI);
    }, 1500);
  }, [addMessage]);

  const handleInputChange = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && isOpen) {
      // Simple overflow lock without position fixed
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // Prevent scrolling but keep layout
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobile, isOpen]);

  // Styles for Slide-over (Mobile) vs Static Split (Desktop)
  const mobileClasses = `
    fixed bottom-0 left-0 right-0 w-full h-[85vh] z-50 bg-gray-50 rounded-t-3xl shadow-2xl
    transform transition-transform duration-300 ease-out
    ${isOpen ? 'translate-y-0' : 'translate-y-full'}
    flex flex-col overflow-hidden
  `;
  
  const desktopClasses = "h-full flex flex-col bg-gray-50 border-l border-gray-200";

  return (
    <div 
      className={isMobile ? mobileClasses : desktopClasses}
      style={isMobile ? { maxHeight: '85vh', height: '85vh' } : undefined}
    >
      {/* Drag handle for mobile */}
      {isMobile && isOpen && (
        <div className="w-full flex justify-center pt-2 pb-1 bg-white">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
      )}
      
      {/* Header - Memoized component */}
      <ChatHeader isMobile={isMobile} onClose={onClose} />

      {/* Messages Area - Memoized component */}
      <ChatMessages 
        messages={messages} 
        isTyping={isTyping} 
        messagesEndRef={messagesEndRef} 
      />

      {/* Input Area - Memoized component */}
      <ChatInput
        inputText={inputText}
        isTyping={isTyping}
        showQuickActions={messages.length === 1 && !isTyping}
        inputRef={inputRef}
        onInputChange={handleInputChange}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatInterface;