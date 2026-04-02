import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { LeaderboardEntry } from '../types';

export const LeaderboardPage = () => {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.getLeaderboard().then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <section className="page-shell">
      <h2 className="mb-1 text-2xl font-black text-amber-300">Leaderboard</h2>
      <p className="mb-4 text-sm text-slate-300">Top players by highest score.</p>

      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={row.userId} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-3">
            <span className="text-sm text-slate-100">#{idx + 1} {row.name}</span>
            <span className="rounded-lg bg-amber-300/20 px-2 py-1 text-sm font-bold text-amber-300">{row.score}</span>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-300">No scores yet.</p>}
      </div>
    </section>
  );
};
