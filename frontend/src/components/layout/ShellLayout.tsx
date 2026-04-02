import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { api } from '../../services/api';

export const ShellLayout = () => {
  const user = useGameStore((s) => s.user);
  const bestScore = useGameStore((s) => s.bestScore);
  const setUser = useGameStore((s) => s.setUser);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const navigate = useNavigate();

  const onLogout = async () => {
    if (user) await api.logout(user.id);
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          <Link to="/home" className="text-lg font-black tracking-wide text-cyan-300">Emoji Dodge</Link>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {user && <span className="stat-chip">{user.name} | Best {bestScore}</span>}
            <button onClick={toggleSound} className="arcade-btn arcade-btn-muted min-w-24">{soundEnabled ? 'Sound On' : 'Sound Off'}</button>
            {user && <button onClick={onLogout} className="arcade-btn bg-rose-500 text-white">Logout</button>}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl p-4 pb-8 sm:p-5">
        <Outlet />
      </main>
    </div>
  );
};
