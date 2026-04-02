import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useGameStore } from '../store/useGameStore';
import type { SessionSummary } from '../types';

export const HistoryPage = () => {
  const user = useGameStore((s) => s.user);
  const [rows, setRows] = useState<SessionSummary[]>([]);

  useEffect(() => {
    if (!user) return;
    api.getHistory(user.id).then(setRows).catch(() => setRows([]));
  }, [user]);

  return (
    <section className="page-shell">
      <h2 className="mb-1 text-2xl font-black text-amber-300">Score History</h2>
      <p className="mb-4 text-sm text-slate-300">Your latest game sessions and durations.</p>
      <div className="space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="stat-chip">Score {row.score}</span>
              <span className="stat-chip">Duration {row.duration.toFixed(1)}s</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">{new Date(row.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {rows.length === 0 && <p className="text-slate-300">No sessions recorded.</p>}
      </div>
    </section>
  );
};
