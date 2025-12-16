import { QuestionData, MockAIResponse, Question } from './types';

export const QUESTION_DATA: QuestionData = {
  id: "q_spm_99",
  topic: "Standard Form",
  difficulty: "Hard",
  raw_text: "Convert the number 0.00000000031 to the form 'plus-minus a times 10 to the power of n', where 1 is less than or equal to a which is less than 10, and n is an integer.",
  answer_type: "text_input"
};

// JSON-structured question data
export const SAMPLE_QUESTION: Question = {
  id: "q1",
  text: "Convert $0.00000000031$ to the form $\\pm a \\times 10^n$ where $1 \\leq |a| < 10$ and $n$ is an integer.",
  subject: "Mathematics",
  difficulty: "Medium",
  topic: "Scientific Notation"
};

export const MOCK_AI_RESPONSES: MockAIResponse = {
  hint: "Count how many times you need to move the decimal point to get a number between 1 and 10. Remember, moving right means a negative exponent!",
  steps: `Here are the steps to solve this problem:

**Step 1:** Identify the first non-zero digit
The first non-zero digit is 3, located at position $10^{-10}$

**Step 2:** Move the decimal point
Move the decimal 10 places to the right: $0.00000000031 = 3.1$

**Step 3:** Apply the exponent rule
Since we moved right, the exponent is negative: $3.1 \\times 10^{-10}$

**Solution:** $3.1 \\times 10^{-10}$`,
  explain: "Scientific notation expresses numbers as $a \\times 10^n$ where $1 \\leq |a| < 10$. For very small numbers (less than 1), we use negative exponents. Each decimal place moved to the right adds -1 to the exponent.",
  default: "I'm here to help! You can ask me for a **hint**, request to **show the steps**, or ask specific questions about scientific notation."
};

// Smart response matcher
export function getAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('hint') || msg.includes('clue') || msg.includes('tip') || msg.includes('help')) {
    return MOCK_AI_RESPONSES.hint;
  }
  
  if (msg.includes('step') || msg.includes('solve') || msg.includes('solution') || msg.includes('reveal')) {
    return MOCK_AI_RESPONSES.steps;
  }
  
  if (msg.includes('explain') || msg.includes('understand') || msg.includes('why') || msg.includes('how')) {
    return MOCK_AI_RESPONSES.explain || MOCK_AI_RESPONSES.default || "Let me help you understand this better!";
  }
  
  return MOCK_AI_RESPONSES.default || "I'm here to help! Feel free to ask for hints or step-by-step solutions.";
}
