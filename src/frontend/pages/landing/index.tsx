import React from 'react';
import ReactDOM from 'react-dom/client';
import { Network } from 'lucide-react';

function Landing() {
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
