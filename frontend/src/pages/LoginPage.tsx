import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useGameStore } from '../store/useGameStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useGameStore((s) => s.setUser);
  const setBestScore = useGameStore((s) => s.setBestScore);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(name.trim());
      setUser(data.user);
      setBestScore(data.bestScore);
      navigate('/home');
    } catch {
      setError('Unable to login. Try another name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
      <div className="page-shell w-full">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">Arcade Login</p>
        <h1 className="mb-2 text-4xl font-black leading-tight text-fuchsia-300">Emoji Dodge</h1>
        <p className="mb-6 text-sm text-slate-300">Pick your unique player name and jump into a mobile-first dodge challenge.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base outline-none ring-cyan-400/60 transition focus:ring"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={20}
          />
          <button className="arcade-btn arcade-btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Enter Arcade'}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      </div>
    </section>
  );
};
