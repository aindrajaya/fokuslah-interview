import { QuestionData, MockAIResponse } from './types';

export const QUESTION_DATA: QuestionData = {
  id: "q_spm_99",
  topic: "Standard Form",
  difficulty: "Hard",
  raw_text: "Convert the number 0.00000000031 to the form 'plus-minus a times 10 to the power of n', where 1 is less than or equal to a which is less than 10, and n is an integer.",
  answer_type: "text_input"
};

export const MOCK_AI_RESPONSES: MockAIResponse = {
  hint: "Count how many times you need to move the decimal point to the right to get 3.1.",
  steps: "1. Identify the first non-zero digit (3).\n2. Place the decimal after it: 3.1.\n3. Count the moves from original position to the new position.\n4. Since you moved right 10 times, the power is negative (-10)."
};
