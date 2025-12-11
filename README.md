# CYBER SNAKE AI 🐍🤖

A Cyberpunk-themed Snake Game built with React and Vite. Features a toggleable AI Autopilot powered by Breadth-First Search (BFS).

## 🎮 Features
- **Cyberpunk Aesthetic**: Neon visuals, dark mode, and glowing effects.
- **Dual Modes**:
  - **Manual Play**: Control with Arrow Keys.
  - **AI Autopilot**: Watch the bot play perfectly using BFS pathfinding.
- **Persistent High Score**: Saves your best run.

## 🧠 AI Algorithm (BFS)
The AI uses **Breadth-First Search** to find the shortest path to the apple:
1. **Pathfinding**: Explores the grid layer by layer to find the shortest route to the food.
2. **Obstacle Avoidance**: Treats the snake's body as walls.
3. **Safety Fallback**: If no path to food is found (trapped), it attempts to make the safest valid move to survive longer.

## 🚀 Setup & Run
Prerequisites: Node.js installed.

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Start Dev Server**
   ```bash
   npm run dev
   ```
3. **Build for Production**
   ```bash
   npm run build
   ```

## 🛠 Tech Stack
- **Core**: React 19, Vite
- **Graphics**: HTML5 Canvas API

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Copyright (c) 2025 **Efe Arslan**.
