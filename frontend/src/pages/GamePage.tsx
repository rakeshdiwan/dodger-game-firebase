import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { GameCanvas } from '../components/game/GameCanvas';
import { api } from '../services/api';
import { useAudio } from '../hooks/useAudio';
import { useGameStore } from '../store/useGameStore';

export const GamePage = () => {
  const user = useGameStore((s) => s.user);
  const bestScore = useGameStore((s) => s.bestScore);
  const setBestScore = useGameStore((s) => s.setBestScore);
  const [result, setResult] = useState<{ score: number; duration: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const { play } = useAudio();

  const onHit = () => play('hit');

  const onGameEnd = useCallback(
    async (score: number, duration: number) => {
      if (!user) return;
      play('gameOver');
      await api.endGame(user.id, score, duration);
      const highest = await api.getHighest(user.id);
      setBestScore(highest.highestScore);
      setResult({ score, duration });
    },
    [user, play, setBestScore],
  );

  if (!user) return <p className="text-slate-200">Please login first.</p>;

  const isNewHigh = result ? result.score >= bestScore && result.score > 0 : false;

  return (
    <section className="space-y-4">
      <div className="page-shell flex items-center justify-between py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Live Run</p>
          <h2 className="text-xl font-black text-fuchsia-300">Avoid the emoji storm</h2>
        </div>
        <span className="stat-chip">Best {bestScore}</span>
      </div>

      <GameCanvas key={resetKey} onHit={onHit} onGameEnd={onGameEnd} />

      {result && (
        <div className="page-shell">
          <h3 className="text-xl font-black text-amber-300">Run Complete</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="stat-chip">Score {result.score}</div>
            <div className="stat-chip">Duration {result.duration.toFixed(1)}s</div>
            <div className="stat-chip">Best {bestScore}</div>
            <div className="stat-chip">Status {isNewHigh ? 'New High' : 'Saved'}</div>
          </div>
          {isNewHigh && <p className="mt-3 font-bold text-emerald-300">New High Score!</p>}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              className="arcade-btn arcade-btn-primary"
              onClick={() => {
                setResult(null);
                setResetKey((k) => k + 1);
              }}
            >
              Restart
            </button>
            <Link className="arcade-btn arcade-btn-muted" to="/home">
              Go Home
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
