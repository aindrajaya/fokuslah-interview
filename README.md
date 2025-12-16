# Smart Tutor - Exam Interface

A responsive educational interface featuring a math question display with an integrated AI tutor assistant ("Ask Jojo"). Built as a technical test for Frontend Engineer position.

## Features

- **Question Display**: Math problems rendered with LaTeX formatting using KaTeX
- **AI Tutor Chat**: Interactive chat interface with mock AI responses
- **Responsive Design**: 
  - Desktop: Split-screen layout (60% question, 40% chat)
  - Mobile: Full-screen question with floating action button for chat drawer
- **Mock Data**: Simulated AI responses with 1.5s delay (no backend required)
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Math Rendering**: KaTeX
- **Icons**: Lucide React

## Run Locally

**Prerequisites**: Node.js 16+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
├── components/
│   ├── ChatInterface.tsx    # Chat UI with drawer/split-screen logic
│   ├── ChatMessage.tsx      # Individual message bubble
│   ├── MathRenderer.tsx     # LaTeX rendering component
│   └── QuestionCard.tsx     # Question display with math formatting
├── App.tsx                  # Main app with responsive layout
├── constants.ts             # Question data
├── types.ts                 # TypeScript interfaces
└── index.tsx               # Entry point
```

## Key Design Decisions

### Mock AI Implementation
The chat interface simulates AI responses based on keyword matching:
- "hint" → Provides a guiding hint
- "steps" or "reveal" → Shows full solution steps
- "check" → Verifies an answer
- Other queries → Generic helpful response

All responses include a 1.5-second delay to simulate network latency and provide realistic UX.

### Math Rendering
Used simple string replacement (hardcoded) to convert plain text to LaTeX format:
- `log_2(2^(x+1))` → `$\log_2(2^{x+1})$`
- Rendered using KaTeX for production-quality typesetting

### Responsive Strategy
- Desktop: CSS Grid with fixed proportions (60/40 split)
- Mobile: Absolute positioning for chat drawer with slide-in animation
- FAB (Floating Action Button) appears only on mobile when chat is closed

## Production Integration Notes

To connect this UI to a real LLM API (e.g., OpenAI, Gemini, or Claude):

1. **Backend Setup**: Create an API endpoint (e.g., `POST /api/chat`)
2. **Request Payload**:
   ```json
   {
     "questionContext": "<raw question text>",
     "history": [{"role": "user", "content": "..."}, ...],
     "newMessage": "user input"
   }
   ```
3. **System Prompt**: 
   ```
   You are Jojo, a helpful math tutor. Guide students to the answer 
   without giving it away immediately. Use LaTeX for math expressions.
   Question context: [inject question data]
   ```
4. **Response Handling**: Stream or batch responses, render with MathRenderer
5. **Error Handling**: Add retry logic, fallback messages, and loading states

## Time Estimate

Completed in approximately 2-3 hours as per assignment requirements.

## Assumptions

- No authentication/authorization needed
- Single question per session (no navigation)
- No answer validation or grading logic
- Mock data sufficient for demonstration
- Desktop = 768px+ width, Mobile = <768px
