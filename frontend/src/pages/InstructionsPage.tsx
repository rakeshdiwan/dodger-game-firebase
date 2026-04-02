export const InstructionsPage = () => {
  return (
    <section className="page-shell space-y-4">
      <h2 className="text-2xl font-black text-amber-300">How to Play</h2>
      <p className="text-sm text-slate-300">Fast, simple, and optimized for touch screens.</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="mb-1 text-sm font-semibold text-cyan-300">Movement</p>
          <p className="text-sm text-slate-200">Drag your player only in the bottom safe zone.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="mb-1 text-sm font-semibold text-cyan-300">Lives</p>
          <p className="text-sm text-slate-200">You start with 5 lives. One collision costs one life.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="mb-1 text-sm font-semibold text-cyan-300">Score</p>
          <p className="text-sm text-slate-200">Score increases while you survive in the arena.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="mb-1 text-sm font-semibold text-cyan-300">Speed</p>
          <p className="text-sm text-slate-200">Emoji speed gradually ramps up over time.</p>
        </div>
      </div>
    </section>
  );
};
