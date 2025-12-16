import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';

/**
 * ChatContainer - Manages all chat-related state and UI
 * 
 * This component isolates chat state from the rest of the app tree,
 * preventing unnecessary re-renders of unrelated components (like QuestionCard)
 * when chat state changes.
 * 
 * Following Steve Kinney's principle: "Start the change at a lower portion of the tree"
 */
const ChatContainer: React.FC = () => {
  console.log('🟢 ChatContainer rendered at', new Date().toISOString());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handleChatOpen = useCallback(() => setIsChatOpen(true), []);
  const handleChatClose = useCallback(() => setIsChatOpen(false), []);
  const emptyCallback = useCallback(() => {}, []); // Stable reference for desktop view

  return (
    <>
      {isMobile ? (
        <>
          {/* Mobile Overlay/Drawer */}
          <div 
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleChatClose}
            style={{ touchAction: 'none' }}
          />
          <ChatInterface 
            isOpen={isChatOpen} 
            onClose={handleChatClose} 
            isMobile={true} 
          />
          
          {/* FAB - Floating Action Button */}
          {!isChatOpen && (
            <button
              onClick={handleChatOpen}
              className="fixed bottom-6 right-6 z-30 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full px-5 py-3 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle size={20} />
              <span className="font-bold">Ask Jojo</span>
            </button>
          )}
        </>
      ) : (
        /* Desktop Split View */
        <aside className="md:flex-[0.4] h-screen border-l border-gray-200 shadow-xl z-10">
          <ChatInterface 
            isOpen={true} 
            onClose={emptyCallback} 
            isMobile={false} 
          />
        </aside>
      )}
    </>
  );
};

ChatContainer.displayName = 'ChatContainer';

export default React.memo(ChatContainer);
