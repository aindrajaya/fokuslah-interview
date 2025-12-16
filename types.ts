export interface QuestionData {
  id: string;
  topic: string;
  difficulty: string;
  raw_text: string;
  answer_type: string;
}

export interface MockAIResponse {
  hint: string;
  steps: string;
}

export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
}
