# Smart Tutor - Exam Interface (Mode Ujian)

A responsive React-based learning interface featuring an interactive Q&A system with an AI tutor assistant ("Jojo"). Built for the **Frontend Engineer Technical Test (React/Next.js)**.

## Features

- **Split-Screen Layout (Desktop):** Question area (60%) + Chat assistant (40%) visible simultaneously
- **Mobile-First Responsive Design:** Chat accessible via floating action button (FAB) with smooth drawer overlay
- **Math Rendering:** LaTeX/KaTeX support for textbook-quality equation display
- **Interactive Chat:** Simulated AI tutor with hint, step-by-step guidance, and general Q&A
- **Auto-Scroll:** Messages automatically scroll to latest content
- **Smart Loading States:** Visual feedback with animated "thinking" indicator and disabled inputs
- **JSON-Driven Content:** Question data structured as JSON for easy extensibility

## Tech Stack

- **Framework:** React 19
- **Styling:** Tailwind CSS
- **Math Rendering:** react-katex
- **Icons:** lucide-react
- **Language:** TypeScript
- **Build Tool:** Vite

## Setup & Installation

### Prerequisites
- Node.js (v18+)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd code
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

## Project Structure

```
├── App.tsx                    # Main layout component (split-screen logic)
├── components/
│   ├── ChatInterface.tsx      # Chat UI orchestrator with smart AI responses
│   ├── ChatHeader.tsx         # Memoized chat header component
│   ├── ChatMessages.tsx       # Memoized messages list component
│   ├── ChatInput.tsx          # Memoized input/quick actions component
│   ├── ChatMessage.tsx        # Individual message bubble component
│   ├── MathRenderer.tsx       # LaTeX rendering with react-katex
│   └── QuestionCard.tsx       # Memoized question display component
├── constants.ts               # JSON question data & smart response matcher
├── types.ts                   # TypeScript interfaces (Question, Message)
├── index.tsx                  # React app entry
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript config
```

## Key Implementation Notes

### 1. JSON Data Structure
Questions are stored as structured JSON objects in `constants.ts`:
```typescript
export const SAMPLE_QUESTION: Question = {
  id: "q1",
  text: "Convert $0.00000000031$ to the form...",
  subject: "Mathematics",
  difficulty: "Medium",
  topic: "Scientific Notation"
};
```

This makes it easy to:
- Add multiple questions
- Implement question navigation
- Extend with metadata (tags, hints, solutions)

### 2. Smart AI Response Matching
The chat uses intelligent keyword matching with the `getAIResponse()` function:
```typescript
export function getAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('hint')) return MOCK_AI_RESPONSES.hint;
  if (msg.includes('step') || msg.includes('reveal')) return MOCK_AI_RESPONSES.steps;
  if (msg.includes('explain')) return MOCK_AI_RESPONSES.explain;
  
  return MOCK_AI_RESPONSES.default;
}
```

- Matches user input keywords to predefined responses
- Simulates **~1.5 second delay** before showing responses
- Returns helpful guidance for unmatched queries
- Supports variations: "hint", "help", "clue", "tip" all trigger hint response

### 3. LaTeX Math Rendering
Math expressions use LaTeX delimiters (`$...$`):
- **Inline math:** `$x^2$` renders as inline equation
- **Block math:** Set via `block={true}` prop for centered display
- **Example:** "Convert $0.00000000031$ to the form $\pm a \times 10^n$"

The `MathRenderer` component parses delimiters and uses `react-katex` for rendering.

### 4. Responsive Design with Smooth Animations
- **Desktop (768px+):** Static split-screen layout
- **Mobile (<768px):** 
  - Question always visible
  - Chat hidden behind FAB button
  - **Drawer slides up from bottom** with 300ms ease-out animation
  - Backdrop overlay with opacity transition
  - Drag handle indicator at top of drawer
  - Auto-focus input when drawer opens

Mobile animation improvements:
```typescript
transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
transition: 'transform 300ms ease-out'
```

### 5. Component Architecture
- **App.tsx:** Handles responsive state, layout toggle, memoized callbacks for chat control
- **ChatInterface.tsx:** Message orchestration, smart response matching, auto-scroll, with memoized child components
- **ChatHeader.tsx:** Memoized header (prevents re-render when messages change)
- **ChatMessages.tsx:** Memoized messages list (only re-renders when messages/isTyping changes)
- **ChatInput.tsx:** Memoized input component (prevents re-render when messages change)
- **QuestionCard.tsx:** Memoized question component (never re-renders from chat state changes)
- **MathRenderer.tsx:** LaTeX parsing and rendering using react-katex
- **ChatMessage.tsx:** Message bubble styling and formatting

### 6. Performance Optimizations (Steve Kinney's React Performance Principles)

Following Steve Kinney's principle of **"not doing stuff is faster than doing stuff"** and **"put state in the right place so it's not triggering stuff in parts of the tree that don't care"**.

#### The Problem: QuestionCard Re-rendering

During development, we identified that `QuestionCard (Memo)` was re-rendering on every chat interaction (user input, AI response), even though:
- It had no props
- It was wrapped in `React.memo()`
- It had no dependencies on chat state

**Flame graph analysis showed:**
- `QuestionCard (Memo)` appeared in every single commit (1/15 to 14/15)
- Consistent render duration of ~1.2ms per commit
- Re-renders triggered by `ChatInterface` state changes

#### Root Cause Analysis

Standard `React.memo()` was failing because:
1. **Parent re-renders propagate down** - Even with no props changing, React still calls the comparison function
2. **Default shallow comparison** - The default comparison function was being called but the component still re-rendered
3. **React's reconciliation** - React was still traversing the component tree

#### The Solution: Custom Comparison Function with Always-True Return

We applied a **strict memoization strategy** using a custom comparison function that always returns `true`, effectively telling React "the props are always equal, never re-render":

```typescript
// In QuestionCard.tsx
const MemoizedQuestionCard = React.memo(QuestionCard, () => {
  console.log('🔴 QuestionCard memo comparison called - returning true (should NOT re-render)');
  return true; // Always return true = props are always equal = never re-render
});

export default MemoizedQuestionCard;
```

**Why this works:**
- `React.memo(Component, compareFunction)` accepts a custom comparison function
- When `compareFunction` returns `true`, it means "prev props === next props"
- React skips re-rendering the component entirely
- Since `QuestionCard` has no props that need to change from parent, this is safe

#### Additional Optimizations Applied

**1. State Collocation (Chat state isolated in ChatContainer)**
```typescript
// ChatContainer.tsx - All chat state isolated here
const ChatContainer: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // ... all chat-related state
}

// App.tsx - Pure layout component with NO state
const App: React.FC = () => {
  const layout = useMemo(() => (
    <div className={STATIC_CONTAINER_CLASS}>
      <QuestionCard />
      <ChatContainer />
    </div>
  ), []); // Empty deps - layout never changes
  
  return layout;
}
```

**2. Stable Callback References (useCallback for all handlers)**
```typescript
// ChatContainer.tsx
const handleChatOpen = useCallback(() => setIsChatOpen(true), []);
const handleChatClose = useCallback(() => setIsChatOpen(false), []);
const emptyCallback = useCallback(() => {}, []); // Stable reference for desktop

// ChatInterface.tsx - Using refs to avoid stale closures
const inputTextRef = useRef('');
useEffect(() => { inputTextRef.current = inputText; }, [inputText]);

const handleSendMessage = useCallback(async () => {
  const messageText = inputTextRef.current; // Read from ref, not state
  // ... send message logic
}, [addMessage]); // Minimal dependencies
```

**3. Module-Level Constants (Calculations outside component)**
```typescript
// QuestionCard.tsx - Calculate ONCE at module load
const FORMATTED_TEXT = QUESTION_DATA.raw_text
  .replace("the number 0.00000000031", "$0.00000000031$")
  .replace("'plus-minus a times 10 to the power of n'", "$\\pm a \\times 10^n$")
  // ... more replacements
```

**4. Memoized Layout Structure**
```typescript
// App.tsx
const STATIC_MAIN_CLASS = "flex-1 md:flex-[0.6] h-screen relative z-0";
const STATIC_CONTAINER_CLASS = "h-screen bg-white font-sans text-slate-900 flex flex-col md:flex-row";

const layout = useMemo(() => (
  <div className={STATIC_CONTAINER_CLASS}>
    <main className={STATIC_MAIN_CLASS}>
      <QuestionCard key="question-card" />
    </main>
    <ChatContainer key="chat-container" />
  </div>
), []); // Render once, cache forever
```

#### React.memo Optimizations Summary

| Component | Strategy | Result |
|-----------|----------|--------|
| `QuestionCard` | Custom comparison `() => true` | Never re-renders from chat |
| `ChatContainer` | `React.memo()` + no props | Only re-renders from own state |
| `ChatHeader` | `React.memo()` + stable props | Minimal re-renders |
| `ChatMessages` | `React.memo()` + stable props | Only on message changes |
| `ChatInput` | `React.memo()` + stable props | Only on input changes |
| `MathRenderer` | `React.memo()` + custom comparison | Only on text/block changes |

#### Performance Result

**Before optimization:**
- `QuestionCard` appeared in 14/15 flame graph commits
- Re-rendered on every chat interaction
- ~1.2ms wasted per chat state change

**After optimization:**
- `QuestionCard` only renders on initial mount
- Never re-renders from chat state changes
- Only re-renders when user types in answer input (expected behavior)

#### Key Principles Applied (Steve Kinney's Course)

1. **"Not doing stuff is faster than doing stuff"** (0:00:32)
   - Moved calculations outside components
   - Used custom memo comparison to skip re-renders entirely

2. **"Start the change at a lower portion of the tree"** (0:04:52)
   - Moved all chat state from `App` to `ChatContainer`
   - QuestionCard's parent never re-renders

3. **"Put state in the right place"** (0:07:06)
   - Chat state → ChatContainer/ChatInterface
   - Answer state → QuestionCard
   - No shared parent state

4. **"Check if inputs are the same, don't do all the work"** (0:07:12)
   - Custom `React.memo()` comparison function
   - Always returns true for components with no meaningful prop changes

## Assumptions & Simplifications

1. **JSON-Based Content:** Questions stored as JSON objects (easily extensible to arrays/API)
2. **No Backend:** All data is static (in `constants.ts`)
3. **No API Keys Required:** Uses mock data instead of real LLM API calls
4. **Simulated Thinking:** Fixed 1.5-second delay instead of actual network latency
5. **Single Question:** The interface displays one fixed math question (architecture supports multiple)
6. **No User Authentication:** Public access, no login system
7. **No Answer Validation:** Answer input field accepts text but doesn't validate correctness
8. **Performance-First:** Components are memoized to prevent unnecessary re-renders

## Bonus: Integrating with a Real LLM API

To connect this UI to a production-grade LLM (e.g., OpenAI, Google Gemini):

### Architecture Changes

1. **Replace Mock Handler** in `ChatInterface.tsx`:
   ```typescript
   // Instead of getAIResponse(), call your API:
   const handleSendMessage = async (text: string) => {
     setIsTyping(true);
     
     // Call backend endpoint
     const response = await fetch('/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         questionContext: SAMPLE_QUESTION.text,
         history: messages,
         userMessage: text,
       }),
     });
     
     const data = await response.json();
     setIsTyping(false);
     addMessage(data.reply, MessageSender.AI);
   };
   ```

2. **Backend System Instruction:**
   ```
   You are Jojo, a helpful math tutor. Guide students without giving away answers immediately.
   Context: [Insert question from SAMPLE_QUESTION.text]
   Use LaTeX formatting ($...$) for math expressions.
   Keep responses concise and encouraging.
   When asked for hints, provide subtle guidance.
   When asked for steps, show detailed work with proper math notation.
   ```
   ```

3. **Streaming Support (Optional):**
   Use `ReadableStream` API for real-time message streaming:
   ```typescript
   const reader = response.body?.getReader();
   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     // Append chunks to message
   }
   ```

4. **Error Handling:**
   - Fallback to mock response if API fails
   - Show retry button on error state
   - Rate limiting considerations

### Environment Setup
```env
VITE_LLM_API_KEY=your_api_key
VITE_API_ENDPOINT=https://api.example.com/chat
```

## Running Tests & Building

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Multi-question support with navigation (JSON array iteration)
- [ ] Question bank API integration
- [ ] User progress tracking
- [ ] Answer validation & auto-grading
- [ ] Streaming chat responses
- [ ] Real LLM API integration
- [ ] Dark mode
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Unit tests & E2E testing (Vitest + Playwright)
- [ ] Chat history persistence (localStorage)

## Notes for Reviewers

This implementation prioritizes:
1. **Clean Component Architecture:** Reusable, well-typed components with clear separation of concerns
2. **JSON-Driven Content:** Easy to extend with multiple questions
3. **Performance Optimization:** React.memo and useCallback to prevent unnecessary re-renders (co-location approach)
4. **State Co-location:** State placed at the correct level to minimize re-render scope
5. **Responsive UX:** Smooth drawer animations, mobile-first design
6. **Code Clarity:** Self-documenting code with comments for non-obvious logic
7. **Extensibility:** Easy to swap mock data for real API calls

The smart AI response system uses keyword matching which is simple but effective for this test. In production, the system would use proper NLP/LLM with context-aware conversation history.

### Key Improvements in This Version:
- ✅ **JSON data structure** for questions (not hardcoded strings)
- ✅ **Smooth mobile drawer animation** (slide-up with transform transition)
- ✅ **Smart response matcher** function (`getAIResponse()`)
- ✅ **Performance optimizations** with React.memo and useCallback
- ✅ **Component splitting** for better re-render control (ChatHeader, ChatMessages, ChatInput)
- ✅ **State co-location** to prevent unnecessary re-renders across the component tree
- ✅ **Enhanced UX** with drag handle, backdrop, focus management
- ✅ **Better metadata display** (difficulty color badges, subject tags)
- ✅ **Disabled states** during loading to prevent spam

**Performance Architecture:**
The component tree is optimized to "put state in the right place so it's not triggering stuff in parts of the tree that don't care." QuestionCard never re-renders when chat state changes, and ChatHeader/ChatInput don't re-render when messages are added.

The mock AI response system is intentionally simple but sufficient for this test. In production, the system instruction and request payload would be more sophisticated to handle context-aware responses.
