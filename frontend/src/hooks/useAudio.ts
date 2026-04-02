import { Howl } from 'howler';
import { useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';

const tinyWav =
  'data:audio/wav;base64,UklGRhQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=';

export const useAudio = () => {
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const sounds = useMemo(
    () => ({
      hit: new Howl({ src: [tinyWav], volume: 0.5 }),
      gameOver: new Howl({ src: [tinyWav], volume: 0.5 }),
      bg: new Howl({ src: [tinyWav], volume: 0.2, loop: true }),
    }),
    [],
  );

  const play = (key: 'hit' | 'gameOver' | 'bg') => {
    if (!soundEnabled) return;
    sounds[key].play();
  };

  const stopBg = () => {
    sounds.bg.stop();
  };

  return { play, stopBg };
};
