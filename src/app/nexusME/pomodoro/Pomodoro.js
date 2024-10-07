'use client';
import { useState, useEffect } from 'react';

export default function Pomodoro() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const toggleStartPause = () => {
    setIsActive(!isActive);
    setIsPaused(isActive && !isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(25 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="min-h-screen h-4/5 flex flex-col items-start text-left p-8 bg-[#ba4949]">
      <h1 className="text-5xl text-white font-normal text-left mb-4 lg:text-5xl md:text-3xl 2xl:text-6xl">Pomodoro Timer</h1>
      <p className='text-light text-red-100 text-left mb-4'>The Pomodoro technique helps you manage time more effectively by breaking work into intervals (25 minutes of focused work followed by a short break). This technique improves concentration, prevents burnout, and enhances productivity by allowing structured breaks, making it easier to maintain long periods of focus without feeling overwhelmed.

By using this timer, you can create a productive workflow that balances effort and rest, leading to more efficient task completion.</p>
      <div className='flex flex-col justify-center items-center w-full'>
      <div className="text-white text-9xl mb-8">
        {formatTime(time)}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={toggleStartPause}
          className="bg-white text-[#ba4949] px-6 py-2 rounded-lg text-xl"
        >
          {isActive && !isPaused ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="bg-white text-[#ba4949] px-6 py-2 rounded-lg text-xl"
        >
          Reset
        </button>
        </div>
      </div>
    </div>
  );
}
