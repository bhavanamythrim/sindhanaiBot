export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  feedback?: 'good' | 'bad' | null;
  isTyping?: boolean;
};

export type ProgressRecord = {
  date: string; // YYYY-MM-DD
  sentiment: number;
  count: number;
};
