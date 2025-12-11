import React, { useRef, useEffect, useState, useCallback } from 'react';
import MobileControls from './MobileControls';

// Game Constants
const GRID_SIZE = 20;
const TILE_SIZE = 20; // Size of each cell in pixels
const CANVAS_WIDTH = 400; // 20 * 20
const CANVAS_HEIGHT = 400;
const SPEED_MANUAL = 100;
const SPEED_AI = 30; // Faster for AI

// Directions
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

const SnakeGame = () => {
    const canvasRef = useRef(null);

    // Game State
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [direction, setDirection] = useState(RIGHT);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('cyberSnakeHighScore') || '0'));
    const [isAI, setIsAI] = useState(false);
    const [aiThinking, setAiThinking] = useState(false); // Visual indicator

    // Generate random food not on snake
    const generateFood = useCallback((currentSnake) => {
        let newFood;
        let isOnSnake = true;
        while (isOnSnake) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
            // eslint-disable-next-line no-loop-func
            isOnSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
        }
        return newFood;
    }, []);

    // Reset Game
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood([{ x: 10, y: 10 }]));
        setDirection(RIGHT);
        setGameOver(false);
        setScore(0);
    };

    /**
     * Breadth-First Search (BFS) Algorithm for AI
     * Finds the shortest path from 'start' to 'target' avoiding 'obstacles' (snake body).
     */
    const getShortestPath = (start, target, obstacles) => {
        // Queue stores [position, path_so_far]
        const queue = [{ pos: start, path: [] }];
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);

        while (queue.length > 0) {
            const { pos, path } = queue.shift();

            // Check if we reached food
            if (pos.x === target.x && pos.y === target.y) {
                return path; // Return array of moves (positions)
            }

            // Explore neighbors
            const neighbors = [
                { x: pos.x, y: pos.y - 1 }, // UP
                { x: pos.x, y: pos.y + 1 }, // DOWN
                { x: pos.x - 1, y: pos.y }, // LEFT
                { x: pos.x + 1, y: pos.y }, // RIGHT
            ];

            for (const neighbor of neighbors) {
                const key = `${neighbor.x},${neighbor.y}`;

                // Check bounds
                if (neighbor.x < 0 || neighbor.x >= GRID_SIZE || neighbor.y < 0 || neighbor.y >= GRID_SIZE) continue;

                // Check obstacles (snake body)
                // Note: We ignore the tail in collision check because it will move immediately,
                // BUT for simple safe BFS we treat it as static to avoid trapping.
                if (obstacles.some(seg => seg.x === neighbor.x && seg.y === neighbor.y)) continue;

                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push({ pos: neighbor, path: [...path, neighbor] });
                }
            }
        }
        return null; // No path found
    };

    // AI Logic: Decide next move
    const decideNextMove = useCallback((currentSnake, currentFood) => {
        const head = currentSnake[0];
        const path = getShortestPath(head, currentFood, currentSnake);

        if (path && path.length > 0) {
            // The first step in the path is the next immediate move
            const nextPos = path[0];
            return { x: nextPos.x - head.x, y: nextPos.y - head.y };
        }

        // Fallback: If no path to food (trapped), try any safe neighbor to survive
        const neighbors = [UP, DOWN, LEFT, RIGHT];
        for (const move of neighbors) {
            const nextX = head.x + move.x;
            const nextY = head.y + move.y;
            // Check bounds and self-collision
            if (
                nextX >= 0 && nextX < GRID_SIZE &&
                nextY >= 0 && nextY < GRID_SIZE &&
                !currentSnake.some(s => s.x === nextX && s.y === nextY)
            ) {
                return move;
            }
        }

        // No valid moves? Accept fate (keep current direction)
        return null;
    }, []);

    // Game Loop
    useEffect(() => {
        if (gameOver) return;

        const gameTick = () => {
            setSnake(prevSnake => {
                let currentDir = direction;

                // If AI is enabled, override direction
                if (isAI) {
                    const aiMove = decideNextMove(prevSnake, food);
                    if (aiMove) {
                        currentDir = aiMove;
                        setDirection(aiMove); // Sync state for render
                        setAiThinking(false);
                    } else {
                        setAiThinking(true); // AI is stuck
                    }
                }

                const newHead = {
                    x: prevSnake[0].x + currentDir.x,
                    y: prevSnake[0].y + currentDir.y,
                };

                // Wall Collision
                if (
                    newHead.x < 0 ||
                    newHead.x >= GRID_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Self Collision
                if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                    // In AI mode, strictly avoid suicide (handled by logic), 
                    // but manual player can hit self.
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Eat Food
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => {
                        const newScore = s + 10;
                        if (newScore > highScore) {
                            setHighScore(newScore);
                            localStorage.setItem('cyberSnakeHighScore', newScore);
                        }
                        return newScore;
                    });
                    setFood(generateFood(newSnake));
                } else {
                    newSnake.pop(); // Remove tail
                }

                return newSnake;
            });
        };

        const interval = setInterval(gameTick, isAI ? SPEED_AI : SPEED_MANUAL);
        return () => clearInterval(interval);
    }, [direction, food, gameOver, isAI, highScore, decideNextMove, generateFood]);

    // Input Handling
    const handleDirectionChange = useCallback((newDir) => {
        setDirection(prevDir => {
            // Prevent 180 degree turns
            if (newDir.x !== 0 && prevDir.x !== 0) return prevDir;
            if (newDir.y !== 0 && prevDir.y !== 0) return prevDir;
            return newDir;
        });
    }, []);

    const handleManualControl = (key) => {
        if (isAI) return;

        switch (key) {
            case 'ArrowUp':
            case 'UP':
                handleDirectionChange(UP);
                break;
            case 'ArrowDown':
            case 'DOWN':
                handleDirectionChange(DOWN);
                break;
            case 'ArrowLeft':
            case 'LEFT':
                handleDirectionChange(LEFT);
                break;
            case 'ArrowRight':
            case 'RIGHT':
                handleDirectionChange(RIGHT);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => handleManualControl(e.key);
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleDirectionChange, isAI]);

    // Render Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Grid (Subtle)
        ctx.strokeStyle = '#121212';
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE_SIZE, 0);
            ctx.lineTo(i * TILE_SIZE, CANVAS_HEIGHT);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * TILE_SIZE);
            ctx.lineTo(CANVAS_WIDTH, i * TILE_SIZE);
            ctx.stroke();
        }

        // Draw Food (Neon Red)
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff073a';
        ctx.fillStyle = '#ff073a';
        ctx.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
        ctx.shadowBlur = 0;

        // Draw Snake (Neon Green)
        snake.forEach((seg, index) => {
            const isHead = index === 0;
            ctx.shadowBlur = isHead ? 20 : 10;
            ctx.shadowColor = '#39ff14';
            ctx.fillStyle = isHead ? '#ccff00' : '#39ff14'; // Brighter head
            ctx.fillRect(seg.x * TILE_SIZE, seg.y * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
        });
        ctx.shadowBlur = 0;

    }, [snake, food]);

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Dashboard */}
            <div className="flex w-full justify-between items-center bg-gray-900 border border-gray-800 p-4 rounded-lg shadow-lg">
                <div className="text-left">
                    <p className="text-gray-400 text-xs">SCORE</p>
                    <p className="text-2xl font-mono text-neonGreen">{score}</p>
                </div>
                <div className="text-center">
                    <button
                        onClick={() => setIsAI(!isAI)}
                        className={`px-4 py-2 font-bold rounded border transition-all duration-300 ${isAI
                            ? 'bg-neonBlue/20 border-neonBlue text-neonBlue shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                            : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400'
                            }`}
                    >
                        {isAI ? 'AI AUTOPILOT: ON' : 'ENABLE AI'}
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-xs">HIGH SCORE</p>
                    <p className="text-2xl font-mono text-white">{highScore}</p>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative group">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className={`border-2 rounded-sm shadow-2xl transition-all duration-500 ${gameOver
                        ? 'border-neonRed shadow-[0_0_30px_rgba(255,7,58,0.5)]'
                        : 'border-neonGreen shadow-[0_0_20px_rgba(57,255,20,0.3)]'
                        }`}
                />

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                        <h2 className="text-4xl font-bold text-neonRed mb-4 drop-shadow-[0_0_10px_rgba(255,7,58,1)]">
                            GAME OVER
                        </h2>
                        <p className="text-gray-300 mb-6 font-mono">
                            FINAL SCORE: {score}
                        </p>
                        <button
                            onClick={resetGame}
                            className="px-6 py-2 bg-neonGreen text-black font-bold rounded hover:bg-white hover:shadow-[0_0_20px_rgba(57,255,20,0.8)] transition-all"
                        >
                            RESTART SYSTEM
                        </button>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="text-gray-500 text-xs flex gap-8 font-mono">
                <span>[ARROWS] CONTROL</span>
                <span>[AI] TOGGLE BOT</span>
            </div>

            {/* Mobile Controls */}
            {!isAI && <MobileControls onMove={handleManualControl} />}
        </div>
    );
};

export default SnakeGame;
