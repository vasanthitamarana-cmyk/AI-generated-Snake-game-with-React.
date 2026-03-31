import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border-4 border-[#FF00FF] relative">
      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#00FFFF] translate-x-1 -translate-y-1" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#00FFFF] -translate-x-1 translate-y-1" />

      <div className="flex justify-between w-full mb-4 px-2 border-b-2 border-[#00FFFF] pb-2">
        <div className="text-[#00FFFF] text-2xl">
          SCORE_REG: <span className="text-[#FF00FF] glitch-text">{score}</span>
        </div>
        <div className="text-[#00FFFF] text-2xl">
          MAX_VAL: {highScore}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#00FFFF]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute ${i === 0 ? 'bg-[#FF00FF] z-10' : 'bg-[#00FFFF] opacity-80'}`}
            style={{
              width: '100%',
              height: '100%',
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
            }}
          />
        ))}

        {/* Render Food */}
        <div
          className="absolute bg-[#FF00FF] glitch-text"
          style={{
            width: '100%',
            height: '100%',
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            zIndex: 5
          }}
        />

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center border-4 border-[#FF00FF] animate-tear">
            <h2 className="text-[#FF00FF] text-5xl mb-6 glitch-text text-center leading-none">CRITICAL<br/>FAILURE</h2>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-[#00FFFF] text-black text-2xl hover:bg-[#FF00FF] transition-colors glitch-text"
            >
              &gt;&gt; REBOOT
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div 
            className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center cursor-pointer border-2 border-[#00FFFF]"
            onClick={() => setIsPaused(false)}
          >
            <p className="text-[#00FFFF] text-3xl glitch-text text-center leading-none">
              AWAITING_INPUT<br/>
              <span className="text-xl text-[#FF00FF] mt-2 block">&gt;&gt; PRESS SPACE</span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex w-full border-t-2 border-[#00FFFF] pt-4 justify-center">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button 
              className="w-12 h-12 bg-black border-2 border-[#00FFFF] flex items-center justify-center text-[#00FFFF] text-2xl active:bg-[#00FFFF] active:text-black hover:border-[#FF00FF] hover:text-[#FF00FF]"
              onClick={() => direction !== 'DOWN' && setDirection('UP')}
            >↑</button>
            <div />
            <button 
              className="w-12 h-12 bg-black border-2 border-[#00FFFF] flex items-center justify-center text-[#00FFFF] text-2xl active:bg-[#00FFFF] active:text-black hover:border-[#FF00FF] hover:text-[#FF00FF]"
              onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
            >←</button>
            <button 
              className="w-12 h-12 bg-black border-2 border-[#00FFFF] flex items-center justify-center text-[#00FFFF] text-2xl active:bg-[#00FFFF] active:text-black hover:border-[#FF00FF] hover:text-[#FF00FF]"
              onClick={() => direction !== 'UP' && setDirection('DOWN')}
            >↓</button>
            <button 
              className="w-12 h-12 bg-black border-2 border-[#00FFFF] flex items-center justify-center text-[#00FFFF] text-2xl active:bg-[#00FFFF] active:text-black hover:border-[#FF00FF] hover:text-[#FF00FF]"
              onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
            >→</button>
          </div>
          <span className="text-lg text-[#FF00FF] mt-4 uppercase tracking-widest">MANUAL_OVERRIDE</span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;

