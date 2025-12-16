import React, { useMemo } from 'react';
import QuestionCard from './components/QuestionCard';
import ChatContainer from './components/ChatContainer';

/**
 * App - Pure Layout Component with NO State
 * 
 * State Collocation Strategy (Steve Kinney's principle):
 * All chat-related state is moved into ChatContainer, preventing
 * any state changes from affecting QuestionCard.
 * 
 * This ensures QuestionCard only re-renders when its own internal
 * state (answer input) changes, not when chat state updates.
 */

// Pre-create static elements outside component to ensure stable references
const STATIC_MAIN_CLASS = "flex-1 md:flex-[0.6] h-screen relative z-0";
const STATIC_CONTAINER_CLASS = "h-screen bg-white font-sans text-slate-900 flex flex-col md:flex-row";

const App: React.FC = () => {
  console.log('🟡 App rendered at', new Date().toISOString());
  
  // Memoize the entire layout structure to prevent any re-renders
  const layout = useMemo(() => (
    <div className={STATIC_CONTAINER_CLASS}>
      {/* 
        SECTION 1: Question Area (Main Stage)
        Desktop: Takes 60% width
        Mobile: Takes full width
        
        This component has NO dependencies on chat state
      */}
      <main className={STATIC_MAIN_CLASS}>
        <QuestionCard key="question-card" />
      </main>

      {/* 
        SECTION 2: Chat Area (Helper)
        Desktop: Takes 40% width, always visible
        Mobile: Hidden initially, toggled via FAB
        
        ALL chat state is isolated in ChatContainer
      */}
      <ChatContainer key="chat-container" />
    </div>
  ), []); // Empty deps - render once and never again
  
  return layout;
};

App.displayName = 'App';

// Memoize App to prevent any unnecessary re-renders from React root
export default React.memo(App);
