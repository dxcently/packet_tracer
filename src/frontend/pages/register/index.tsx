import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Network, Lock, Mail, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const GRID_SIZE = 40;
const MAX_DRIFT = 15;
const NODE_SPEED = 0.3;
const COLLISION_RADIUS = 12;
const LINE_CONNECT_DIST = GRID_SIZE * 1.6;
const MAX_LINE_OPACITY = 0.3;
const MAX_VELOCITY_MULTIPLIER = 3;

type Status = 'idle' | 'loading' | 'success' | 'error';

function Register() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  // Mouse-following glow overlay (batched via rAF to avoid thrashing style recalculation)
  useEffect(() => {
    let rafId: number | null = null;
    let pendingX = -9999;
    let pendingY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.background = `radial-gradient(circle 250px at ${pendingX}px ${pendingY}px, rgba(255,0,0,0.18) 0%, transparent 70%)`;
          }
          rafId = null;
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Animated moving grid nodes on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Node = { baseX: number; baseY: number; x: number; y: number; vx: number; vy: number };

    let nodes: Node[] = [];
    let grid: (Node | undefined)[][] = [];
    let numCols = 0;
    let numRows = 0;
    let animationId: number;

    function initNodes() {
      nodes = [];
      numCols = Math.ceil(canvas!.width / GRID_SIZE) + 1;
      numRows = Math.ceil(canvas!.height / GRID_SIZE) + 1;
      grid = Array.from({ length: numCols }, () => new Array(numRows).fill(undefined));
      for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
          const angle = Math.random() * Math.PI * 2;
          const node: Node = {
            baseX: col * GRID_SIZE,
            baseY: row * GRID_SIZE,
            x: col * GRID_SIZE,
            y: row * GRID_SIZE,
            vx: Math.cos(angle) * NODE_SPEED,
            vy: Math.sin(angle) * NODE_SPEED,
          };
          nodes.push(node);
          grid[col][row] = node;
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        const dx = node.x - node.baseX;
        const dy = node.y - node.baseY;
        if (Math.abs(dx) >= MAX_DRIFT) {
          node.vx *= -1;
          node.x = node.baseX + Math.sign(dx) * MAX_DRIFT;
        }
        if (Math.abs(dy) >= MAX_DRIFT) {
          node.vy *= -1;
          node.y = node.baseY + Math.sign(dy) * MAX_DRIFT;
        }
      }

      ctx!.lineWidth = 0.6;
      ctx!.strokeStyle = 'rgba(255,0,0,1)';
      for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
          const node = grid[col][row];
          if (!node) continue;

          const neighbours: (Node | undefined)[] = [
            col + 1 < numCols ? grid[col + 1][row] : undefined,
            row + 1 < numRows ? grid[col][row + 1] : undefined,
            col + 1 < numCols && row + 1 < numRows ? grid[col + 1][row + 1] : undefined,
            col > 0 && row + 1 < numRows ? grid[col - 1][row + 1] : undefined,
          ];

          for (const nb of neighbours) {
            if (!nb) continue;
            const dx = node.x - nb.x;
            const dy = node.y - nb.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (dist < LINE_CONNECT_DIST) {
              ctx!.globalAlpha = (1 - dist / LINE_CONNECT_DIST) * MAX_LINE_OPACITY;
              ctx!.beginPath();
              ctx!.moveTo(node.x, node.y);
              ctx!.lineTo(nb.x, nb.y);
              ctx!.stroke();
            }

            if (dist > 0 && dist < COLLISION_RADIUS) {
              const nx = dx / dist;
              const ny = dy / dist;
              const relVx = node.vx - nb.vx;
              const relVy = node.vy - nb.vy;
              const relVn = relVx * nx + relVy * ny;
              if (relVn < 0) {
                node.vx -= relVn * nx;
                node.vy -= relVn * ny;
                nb.vx += relVn * nx;
                nb.vy += relVn * ny;
                const maxSpeed = NODE_SPEED * MAX_VELOCITY_MULTIPLIER;
                const clamp = (v: number) => Math.max(-maxSpeed, Math.min(maxSpeed, v));
                node.vx = clamp(node.vx);
                node.vy = clamp(node.vy);
                nb.vx = clamp(nb.vx);
                nb.vy = clamp(nb.vy);
              }
            }
          }
        }
      }
      ctx!.globalAlpha = 1;

      for (const node of nodes) {
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(255, 0, 0, 0.35)';
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    initNodes();
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length <= 2){
      setStatus('error');
      setMessage("Please enter a valid username.");
      return;
    }else if(!email.includes('@') ){
      setStatus('error');
      setMessage("You are missing '@' in your email field");
      return;
    }else if (!email.includes('.')){
      setStatus('error');
      setMessage("You are missing a '.' in your email field");
      return;
    }
    if (password.length < 8){
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }else if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const payload = { email, password };

    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Account created. Redirecting to login...');
        setTimeout(() => { window.location.href = '/login/'; }, 1500);
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus('error');
        setMessage((data as { message?: string }).message ?? 'Registration failed. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-stealth-black-600 font-orbit overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#ff0000 1px, transparent 1px), linear-gradient(90deg, #ff0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Mouse-following glow overlay */}
      <div ref={glowRef} className="absolute inset-0 pointer-events-none" />

      {/* Animated nodes canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Register card */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-3 text-red-red-500">
            <Network size={40} className="drop-shadow-[0_0_16px_#ff0000]" />
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-red-red-400 drop-shadow-[0_0_20px_rgba(255,0,0,0.6)] uppercase">
            Packet Tracer
          </h1>
          <p className="text-red-red-300/50 text-xs tracking-widest uppercase">
            Create New Account
          </p>
        </div>

        {/* Card */}
        <div className="border-2 border-red-red-700 bg-stealth-black-500 shadow-[0_0_30px_rgba(255,0,0,0.15)] p-8">
          <h2 className="text-red-red-500 text-lg tracking-widest uppercase mb-6 text-center">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-red-red-600 text-xs tracking-widest uppercase">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3 text-red-red-700 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="enter email address"
                  className="
                    w-full pl-9 pr-4 py-2.5
                    border border-red-red-800 bg-stealth-black-600
                    text-red-red-300 placeholder-stealth-black-50
                    text-sm tracking-wider
                    focus:outline-none focus:border-red-red-500
                    focus:shadow-[0_0_10px_rgba(255,0,0,0.25)]
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-red-red-600 text-xs tracking-widest uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3 text-red-red-700 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="create a password"
                  className="
                    w-full pl-9 pr-4 py-2.5
                    border border-red-red-800 bg-stealth-black-600
                    text-red-red-300 placeholder-stealth-black-50
                    text-sm tracking-wider
                    focus:outline-none focus:border-red-red-500
                    focus:shadow-[0_0_10px_rgba(255,0,0,0.25)]
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-red-red-600 text-xs tracking-widest uppercase">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3 text-red-red-700 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="confirm your password"
                  className="
                    w-full pl-9 pr-4 py-2.5
                    border border-red-red-800 bg-stealth-black-600
                    text-red-red-300 placeholder-stealth-black-50
                    text-sm tracking-wider
                    focus:outline-none focus:border-red-red-500
                    focus:shadow-[0_0_10px_rgba(255,0,0,0.25)]
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                />
              </div>
            </div>

            {/* Status message */}
            {status !== 'idle' && (
              <div className={`
                flex items-center gap-2 px-3 py-2 border text-xs tracking-wider
                ${status === 'success'
                  ? 'border-green-wildfire-700 text-green-wildfire-400 bg-green-wildfire-950'
                  : status === 'error'
                    ? 'border-red-red-700 text-red-red-400 bg-red-red-950'
                    : 'border-red-red-800 text-red-red-600 bg-stealth-black-600'}
              `}>
                {status === 'loading' && <Loader size={12} className="animate-spin shrink-0" />}
                {status === 'success' && <CheckCircle size={12} className="shrink-0" />}
                {status === 'error' && <AlertCircle size={12} className="shrink-0" />}
                <span>{status === 'loading' ? 'Creating account...' : message}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                mt-1 w-full py-3 border-2 border-red-red-500
                text-red-red-400 text-sm tracking-widest uppercase
                bg-stealth-black-500
                transition-all duration-300
                hover:bg-red-red-950 hover:border-red-red-300
                hover:text-red-red-200 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:bg-stealth-black-500 disabled:hover:shadow-none
              "
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-xs tracking-wider text-stealth-black-50">
            Already have an account?{' '}
            <a
              href="/login/"
              className="
                text-green-wildfire-500 hover:text-green-wildfire-300
                hover:drop-shadow-[0_0_6px_rgba(0,255,0,0.6)]
                transition-all duration-200 uppercase tracking-widest
              "
            >
              Login
            </a>
          </p>
        </div>

        {/* Back link */}
        <p className="mt-4 text-center text-xs tracking-wider">
          <a
            href="/"
            className="
              text-red-red-800 hover:text-red-red-600
              transition-all duration-200 uppercase tracking-widest
            "
          >
            ← Back
          </a>
        </p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#root')!);
root.render(<Register />);
