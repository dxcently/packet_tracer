import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Network } from 'lucide-react';

const GRID_SIZE = 40;
const MAX_DRIFT = 8;
const NODE_SPEED = 0.3;

function Landing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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
            glowRef.current.style.background = `radial-gradient(circle 250px at ${pendingX}px ${pendingY}px, rgba(0,255,0,0.22) 0%, transparent 70%)`;
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
    let animationId: number;

    function initNodes() {
      nodes = [];
      const cols = Math.ceil(canvas!.width / GRID_SIZE) + 1;
      const rows = Math.ceil(canvas!.height / GRID_SIZE) + 1;
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const angle = Math.random() * Math.PI * 2;
          nodes.push({
            baseX: col * GRID_SIZE,
            baseY: row * GRID_SIZE,
            x: col * GRID_SIZE,
            y: row * GRID_SIZE,
            vx: Math.cos(angle) * NODE_SPEED,
            vy: Math.sin(angle) * NODE_SPEED,
          });
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
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(0, 255, 0, 0.35)';
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

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-stealth-black-600 font-orbit overflow-hidden">
      {/* Background grid effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Mouse-following glow overlay */}
      <div ref={glowRef} className="absolute inset-0 pointer-events-none" />

      {/* Animated moving nodes canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo / Icon */}
        <div className="flex items-center gap-3 text-green-wildfire-500">
          <Network size={48} className="drop-shadow-[0_0_16px_#00ff00]" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold tracking-widest text-green-wildfire-400 drop-shadow-[0_0_20px_rgba(0,255,0,0.6)] uppercase">
          Packet Tracer
        </h1>

        {/* Tagline */}
        <p className="text-green-wildfire-300/70 text-sm tracking-widest uppercase">
          Visualize. Simulate. Dominate.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 mt-4">
          <a
            href="/login/"
            className="
              px-8 py-3 border-2 border-green-wildfire-500 rounded
              text-green-wildfire-400 text-sm tracking-widest uppercase
              bg-stealth-black-500
              transition-all duration-300
              hover:bg-green-wildfire-950 hover:border-green-wildfire-300
              hover:text-green-wildfire-200 hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]
            "
          >
            Login
          </a>
          <a
            href="/register/"
            className="
              px-8 py-3 border-2 border-red-red-500 rounded
              text-red-red-400 text-sm tracking-widest uppercase
              bg-stealth-black-500
              transition-all duration-300
              hover:bg-red-red-950 hover:border-red-red-300
              hover:text-red-red-200 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]
            "
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#root')!);
root.render(<Landing />);
