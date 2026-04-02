import type { LeaderboardEntry, SessionSummary, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? 'Request failed');
  }

  return payload.data;
};

export const api = {
  login: (name: string) => request<{ user: User; bestScore: number }>('/api/users/login', { method: 'POST', body: JSON.stringify({ name }) }),
  logout: (userId: string) => request<{ loggedOut: boolean }>('/api/users/logout', { method: 'POST', body: JSON.stringify({ userId }) }),
  startGame: (userId: string) => request<{ sessionId: string; startedAt: string }>('/api/game/start', { method: 'POST', body: JSON.stringify({ userId }) }),
  endGame: (userId: string, score: number, duration: number) =>
    request<SessionSummary>('/api/game/end', { method: 'POST', body: JSON.stringify({ userId, score, duration }) }),
  getHistory: (userId: string) => request<SessionSummary[]>(`/api/scores/history/${userId}`),
  getHighest: (userId: string) => request<{ highestScore: number }>(`/api/scores/highest/${userId}`),
  getLeaderboard: () => request<LeaderboardEntry[]>('/api/scores/leaderboard'),
};
