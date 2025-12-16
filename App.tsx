import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { QUESTION_DATA } from './constants';
import QuestionCard from './components/QuestionCard';
import ChatInterface from './components/ChatInterface';

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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-hidden flex flex-col md:flex-row">
      
      {/* 
        SECTION 1: Question Area (Main Stage)
        Desktop: Takes 60% width
        Mobile: Takes full width
      */}
      <main className="flex-1 md:flex-[0.6] h-screen relative z-0">
        <QuestionCard data={QUESTION_DATA} />
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
             onClick={() => setIsChatOpen(false)}
          />
          <ChatInterface 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            isMobile={true} 
          />
          
          {/* FAB - Floating Action Button */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
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
            onClose={() => {}} 
            isMobile={false} 
          />
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
