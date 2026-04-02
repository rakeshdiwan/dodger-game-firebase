import { create } from 'zustand';
import type { User } from '../types';

interface GameStore {
  user: User | null;
  bestScore: number;
  soundEnabled: boolean;
  setUser: (user: User | null) => void;
  setBestScore: (score: number) => void;
  toggleSound: () => void;
}

const initialSound = localStorage.getItem('emoji_dodge_sound') !== 'off';

export const useGameStore = create<GameStore>((set) => ({
  user: null,
  bestScore: 0,
  soundEnabled: initialSound,
  setUser: (user) => set({ user }),
  setBestScore: (bestScore) => set({ bestScore }),
  toggleSound: () =>
    set((state) => {
      const next = !state.soundEnabled;
      localStorage.setItem('emoji_dodge_sound', next ? 'on' : 'off');
      return { soundEnabled: next };
    }),
}));
