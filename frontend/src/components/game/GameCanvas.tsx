import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameStatus } from '../../types';

const EMOJIS = ['🔥', '💣', '⚡', '😈', '🍕', '🛸'];
const EMOJI_SIZE = 38;

interface Obstacle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  emoji: string;
}

interface GameCanvasProps {
  onGameEnd: (score: number, duration: number) => void;
  onHit: () => void;
}

export const GameCanvas = ({ onGameEnd, onHit }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [hitFlash, setHitFlash] = useState(false);

  const obstaclesRef = useRef<Obstacle[]>([]);
  const playerRef = useRef({ x: 180, y: 500, radius: 18 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const speedMultiplierRef = useRef<number>(1);
  const dprRef = useRef<number>(1);

  const canvasSize = useMemo(() => ({ width: 360, height: 560 }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    dprRef.current = dpr;
    canvas.width = Math.floor(canvasSize.width * dpr);
    canvas.height = Math.floor(canvasSize.height * dpr);
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
  }, [canvasSize]);

  useEffect(() => {
    setStatus('countdown');
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStatus('playing');
          startTimeRef.current = performance.now();
          lastFrameRef.current = performance.now();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status !== 'playing') {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastFrameRef.current) / 1000;
      lastFrameRef.current = timestamp;

      speedMultiplierRef.current += delta * 0.04;

      if (timestamp - lastSpawnRef.current > 550) {
        lastSpawnRef.current = timestamp;
        obstaclesRef.current.push({
          id: timestamp,
          x: Math.random() * (canvasSize.width - EMOJI_SIZE),
          y: -20,
          speed: (80 + Math.random() * 80) * speedMultiplierRef.current,
          size: EMOJI_SIZE,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        });
      }

      obstaclesRef.current = obstaclesRef.current
        .map((obs) => ({ ...obs, y: obs.y + obs.speed * delta }))
        .filter((obs) => obs.y < canvasSize.height + 30);

      const player = playerRef.current;
      for (const obs of obstaclesRef.current) {
        const dx = obs.x + obs.size / 2 - player.x;
        const dy = obs.y + obs.size / 2 - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + obs.size / 2) {
          obstaclesRef.current = obstaclesRef.current.filter((o) => o.id !== obs.id);
          onHit();
          setHitFlash(true);
          setTimeout(() => setHitFlash(false), 130);
          setLives((prev) => prev - 1);
          break;
        }
      }

      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fillRect(0, canvasSize.height * 0.72, canvasSize.width, canvasSize.height * 0.28);

      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, canvasSize.height * 0.72);
      ctx.lineTo(canvasSize.width, canvasSize.height * 0.72);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = `700 ${EMOJI_SIZE}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
      for (const obs of obstaclesRef.current) {
        // Backplate improves readability without dimming emoji colors.
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.arc(obs.x + obs.size / 2, obs.y + obs.size / 2 - 4, obs.size * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
        ctx.shadowBlur = 6;
        ctx.fillText(obs.emoji, obs.x, obs.y);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.fillStyle = '#22d3ee';
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();

      const nextScore = Math.floor((timestamp - startTimeRef.current) / 100);
      setScore(nextScore);

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [status, canvasSize, onHit]);

  useEffect(() => {
    if (lives <= 0 && status !== 'gameover') {
      setStatus('gameover');
      onGameEnd(score, (performance.now() - startTimeRef.current) / 1000);
    }
  }, [lives, status, score, onGameEnd]);

  const onPointerMove = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    if (status !== 'playing') return;
    const rect = evt.currentTarget.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    const scaledX = x * (canvasSize.width / rect.width);
    const scaledY = y * (canvasSize.height / rect.height);
    playerRef.current.x = Math.max(18, Math.min(canvasSize.width - 18, scaledX));
    playerRef.current.y = Math.max(canvasSize.height * 0.72 + 18, Math.min(canvasSize.height - 18, scaledY));
  };

  return (
    <div className="page-shell relative mx-auto w-fit p-3 sm:p-4">
      <div className="mb-3 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
        <div className="stat-chip">Score {score}</div>
        <div className="stat-chip">Lives {lives}</div>
        <div className="stat-chip">Speed {speedMultiplierRef.current.toFixed(2)}x</div>
      </div>

      {hitFlash && (
        <motion.div
          className="pointer-events-none absolute inset-3 rounded-2xl bg-rose-400/40"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
        />
      )}

      {status === 'countdown' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-7xl font-black text-amber-300">{countdown}</div>
      )}

      {status === 'gameover' && (
        <div className="absolute inset-3 z-10 flex items-center justify-center rounded-2xl bg-black/75 text-3xl font-black text-rose-300">Game Over</div>
      )}

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="touch-none rounded-2xl border border-cyan-400/30 shadow-[0_12px_40px_rgba(34,211,238,0.18)]"
        onPointerMove={onPointerMove}
      />

      <p className="mt-3 text-center text-xs text-slate-300">Drag in the lower zone only. Stay alive as speed rises.</p>
    </div>
  );
};
