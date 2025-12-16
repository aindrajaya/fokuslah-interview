import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { MessageCircle } from 'lucide-react';
import QuestionCard from './components/QuestionCard';

// Lazy load ChatInterface to reduce initial bundle size
const ChatInterface = lazy(() => import('./components/ChatInterface'));

const App: React.FC = () => {
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

  // Memoize callbacks to prevent unnecessary re-renders
  const handleChatOpen = useCallback(() => setIsChatOpen(true), []);
  const handleChatClose = useCallback(() => setIsChatOpen(false), []);

  return (
    <div className={`h-screen bg-white font-sans text-slate-900 flex flex-col md:flex-row ${isMobile && isChatOpen ? 'overflow-hidden' : ''}`}>
      
      {/* 
        SECTION 1: Question Area (Main Stage)
        Desktop: Takes 60% width
        Mobile: Takes full width
      */}
      <main className={`flex-1 md:flex-[0.6] h-screen relative z-0 ${isMobile && isChatOpen ? 'overflow-hidden' : ''}`}>
        <QuestionCard />
      </main>

      {/* 
        SECTION 2: Chat Area (Helper)
        Desktop: Takes 40% width, always visible
        Mobile: Hidden initially, toggled via FAB
      */}
      {isMobile ? (
        <>
          {/* Mobile Overlay/Drawer */}
          <div 
             className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
             onClick={handleChatClose}
             style={{ touchAction: 'none' }}
          />
          <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-gray-50 rounded-t-3xl z-50 flex items-center justify-center">Loading...</div>}>
            <ChatInterface 
              isOpen={isChatOpen} 
              onClose={handleChatClose} 
              isMobile={true} 
            />
          </Suspense>
          
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
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading chat...</div>}>
            <ChatInterface 
              isOpen={true} 
              onClose={() => {}} 
              isMobile={false} 
            />
          </Suspense>
        </aside>
      )}

      {/* 
        BONUS NOTE (Requested in PDF):
        Integration with Real LLM API:
        
        To connect this UI to a real LLM (e.g., Gemini or OpenAI):
        
        1. Replace the `setTimeout` in `ChatInterface.tsx` with an async `fetch` call.
        2. Endpoint: POST /api/chat
        3. Payload: 
           {
             "questionContext": QUESTION_DATA.raw_text,
             "history": messages.map(m => ({ role: m.sender, content: m.text })),
             "newMessage": text
           }
        4. System Prompt on Backend: "You are Jojo, a helpful math tutor. Use the provided question context..."
        5. The backend would return the streaming response or complete text, which we then push to the `messages` state.
      */}
    </div>
  );
};

export default App;
