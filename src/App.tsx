import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-mono relative overflow-hidden">
      {/* Glitch Art Overlays */}
      <div className="static-noise" />
      <div className="scanline" />

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-8">
        <header className="text-center space-y-2 w-full border-b-4 border-[#FF00FF] pb-6 animate-tear">
          <h1 className="text-6xl md:text-8xl font-black tracking-widest glitch-text">
            NEON_RHYTHM.EXE
          </h1>
          <p className="text-[#00FFFF] text-2xl tracking-[0.5em] mt-4">
            SYS.STATUS: <span className="text-[#FF00FF] animate-pulse">ONLINE</span> // UPLINK_ESTABLISHED
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full mt-4">
          <div className="order-2 lg:order-1 w-full max-w-md">
            <MusicPlayer />
          </div>

          <div className="order-1 lg:order-2">
            <SnakeGame />
          </div>

          <div className="hidden xl:flex flex-col gap-8 order-3 w-72">
            <div className="p-4 border-4 border-[#00FFFF] bg-black relative">
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF00FF] -translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF00FF] translate-x-1 translate-y-1" />
              <h4 className="text-2xl text-[#FF00FF] border-b-2 border-[#FF00FF] mb-4 glitch-text">&gt;&gt; MAN_PAGE</h4>
              <ul className="space-y-4 text-xl">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF00FF]">&gt;</span>
                  <span>[↑↓←→] DIRECT_OVERRIDE</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF00FF]">&gt;</span>
                  <span>[SPC] HALT_PROCESS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF00FF]">&gt;</span>
                  <span>OBJ: CONSUME_DATA_PACKETS</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border-4 border-[#FF00FF] bg-black animate-tear relative">
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#00FFFF] translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00FFFF] -translate-x-1 translate-y-1" />
              <h4 className="text-2xl text-[#00FFFF] border-b-2 border-[#00FFFF] mb-4">&gt;&gt; DIAGNOSTICS</h4>
              <div className="space-y-4 text-xl">
                <div className="flex justify-between">
                  <span>MEM_LEAK:</span>
                  <span className="text-[#FF00FF] glitch-text">DETECTED</span>
                </div>
                <div className="flex justify-between">
                  <span>CPU_TEMP:</span>
                  <span>99°C</span>
                </div>
                <div className="flex justify-between">
                  <span>VOID_PROX:</span>
                  <span className="animate-pulse text-[#FF00FF]">IMMINENT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto pt-8 text-[#00FFFF] text-xl tracking-widest border-t-2 border-[#00FFFF] w-full text-center">
          END_OF_FILE // 0x000000
        </footer>
      </main>
    </div>
  );
}
