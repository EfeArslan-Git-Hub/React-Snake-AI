import React from 'react';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <div className="min-h-screen bg-cyberBlack flex flex-col items-center justify-center p-4">
      {/* Portfolio Button - Fixed to Top-Left of Viewport */}
      <a
        href="https://efe-arslan-portfolio.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 px-4 py-2 text-xs lg:text-sm border border-neonRed text-neonRed bg-black/50 backdrop-blur-sm hover:bg-neonRed hover:text-black transition-all duration-300 font-mono tracking-widest rounded shadow-[0_0_10px_rgba(255,7,58,0.3)] z-50 flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">«</span> PORTFOLIO
      </a>

      <header className="mb-8 text-center w-full max-w-2xl px-4 mt-12 lg:mt-0">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neonGreen to-neonBlue drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
          CYBER SNAKE AI
        </h1>
        <p className="text-gray-400 mt-2 text-sm font-light tracking-wider">
          Made by <span className="text-neonBlue">Efe Arslan</span>
        </p>
        <p className="text-gray-500 mt-1 tracking-widest text-xs">
          NEURAL NETWORK LINK: <span className="text-neonRed">OFFLINE</span>
        </p>
      </header>

      <main className="w-full max-w-2xl">
        <SnakeGame />
      </main>

      <footer className="mt-8 text-xs text-gray-600 font-mono">
        CYBER SNAKE AI made by efe arslan | V 1.1.0
      </footer>
    </div>
  );
}

export default App;
