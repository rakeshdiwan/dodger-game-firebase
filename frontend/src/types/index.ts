export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'gameover';

export interface User {
  id: string;
  name: string;
  createdAt: string;
  lastPlayedAt?: string;
}

export interface SessionSummary {
  _id: string;
  score: number;
  duration: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}
