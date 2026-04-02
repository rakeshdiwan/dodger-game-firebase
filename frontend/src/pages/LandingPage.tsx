import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';

const navCards = [
  { to: '/game', title: 'Start Game', subtitle: 'Dodge falling emoji now', tone: 'from-emerald-400 to-cyan-400' },
  { to: '/instructions', title: 'Instructions', subtitle: 'Learn controls and rules', tone: 'from-sky-400 to-blue-500' },
  { to: '/history', title: 'Score History', subtitle: 'View your past sessions', tone: 'from-violet-400 to-fuchsia-500' },
  { to: '/leaderboard', title: 'Leaderboard', subtitle: 'Top players and scores', tone: 'from-amber-300 to-orange-400' },
];

export const LandingPage = () => {
  const user = useGameStore((s) => s.user);
  const bestScore = useGameStore((s) => s.bestScore);

  return (
    <section className="space-y-4 sm:space-y-5">
      <div className="page-shell bg-gradient-to-br from-indigo-900/70 via-slate-900/70 to-slate-950/80">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Welcome Back</p>
        <h1 className="mt-1 text-3xl font-black text-fuchsia-300 sm:text-4xl">Emoji Dodge</h1>
        <p className="mt-2 text-sm text-slate-200">Stay in the safe zone, dodge chaos, and climb the leaderboard.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="stat-chip">Player: {user?.name}</span>
          <span className="stat-chip">Best Score: {bestScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {navCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:-translate-y-0.5 hover:border-white/25"
          >
            <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${card.tone}`} />
            <h2 className="text-lg font-bold text-white">{card.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{card.subtitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
