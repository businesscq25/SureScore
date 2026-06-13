export type QuestionMode = 'low' | 'mid' | 'max' | 'auto';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'question' | 'recommendation' | 'follow_up' | 'error';
  options?: string[];
  hasOther?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

export interface RecentSearch {
  id: string;
  query: string;
  icon: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  query: string;
  messages: Message[];
  mode: QuestionMode;
  timestamp: number;
}

export interface AIResponse {
  type: 'question' | 'recommendation' | 'follow_up' | 'error';
  message: string;
  options?: string[];
  hasOther?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}
