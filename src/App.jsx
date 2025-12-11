import React from 'react';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <div className="min-h-screen bg-cyberBlack flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neonGreen to-neonBlue drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
          CYBER SNAKE AI
        </h1>
        <p className="text-gray-400 mt-2 tracking-widest text-sm">
          NEURAL NETWORK LINK: <span className="text-neonRed">OFFLINE</span>
        </p>
      </header>

      <main className="w-full max-w-2xl">
        <SnakeGame />
      </main>

      <footer className="mt-8 text-xs text-gray-600">
        SYSTEM STATUS: STABLE | V 1.0.0
      </footer>
    </div>
  );
}

export default App;
