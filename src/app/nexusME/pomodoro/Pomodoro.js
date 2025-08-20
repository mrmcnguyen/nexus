'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Pomodoro() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [time, setTime] = useState(25 * 60); // seconds remaining in current phase
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || 'Pomodoro Timer';
  const description = searchParams.get('description') || '';

  const totalDuration = (isBreak ? breakMinutes : workMinutes) * 60;
  const progressPercent = Math.max(0, Math.min(1, time / totalDuration));
  const progressDeg = progressPercent * 360;

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

  // Auto-transition between work and break phases
  useEffect(() => {
    if (!isActive) return;
    if (time === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setTime(Math.max(1, breakMinutes) * 60);
        setIsPaused(false);
        setIsActive(true);
      } else {
        setIsActive(false);
        setIsPaused(false);
        setIsBreak(false);
        setTime(Math.max(1, workMinutes) * 60);
      }
    }
  }, [time, isActive, isBreak, breakMinutes, workMinutes]);

  // If user adjusts work duration while idle, sync the countdown
  useEffect(() => {
    if (!isActive) {
      setIsBreak(false);
      setTime(Math.max(1, workMinutes) * 60);
    }
  }, [workMinutes, isActive]);

  const toggleStartPause = () => {
    if (!isActive) {
      if (time <= 0) {
        setIsBreak(false);
        setTime(Math.max(1, workMinutes) * 60);
      }
      setIsActive(true);
      setIsPaused(false);
      return;
    }
    setIsPaused((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsBreak(false);
    setTime(Math.max(1, workMinutes) * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const progressColor = isBreak ? '#5EF7A2' : '#91C8FF';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d0d10]">
      {/* Animated vibrant background when active */}
      <div
        className={`pointer-events-none absolute inset-0 transition-[opacity,filter] duration-700 ${isActive ? 'opacity-100' : 'opacity-70'}`}
        style={{ filter: isActive ? 'saturate(1.45) brightness(1.15)' : 'saturate(1.1) brightness(1)' }}
      >
        <div
          className="absolute -top-44 -left-40 w-[560px] h-[560px] rounded-full blur-[140px]"
          style={{ background: isBreak ? 'radial-gradient(circle at 50% 50%, rgba(112,168,255,0.45), rgba(0,0,0,0) 60%)' : 'radial-gradient(circle at 50% 50%, rgba(255,168,112,0.45), rgba(0,0,0,0) 60%)', animation: 'floatGlow 16s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute -bottom-36 -right-40 w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{ background: isBreak ? 'radial-gradient(circle at 50% 50%, rgba(100,255,180,0.38), rgba(0,0,0,0) 60%)' : 'radial-gradient(circle at 50% 50%, rgba(255,100,100,0.38), rgba(0,0,0,0) 60%)', animation: 'floatGlow 20s ease-in-out infinite alternate-reverse' }}
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full blur-[160px]"
          style={{ background: isBreak ? 'radial-gradient(circle at 50% 50%, rgba(140,210,255,0.32), rgba(0,0,0,0) 60%)' : 'radial-gradient(circle at 50% 50%, rgba(255,210,140,0.32), rgba(0,0,0,0) 60%)', animation: 'floatGlow 24s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute top-10 right-20 w-[360px] h-[360px] rounded-full blur-[120px]"
          style={{ background: isBreak ? 'radial-gradient(circle at 50% 50%, rgba(120,255,220,0.28), rgba(0,0,0,0) 60%)' : 'radial-gradient(circle at 50% 50%, rgba(255,120,180,0.28), rgba(0,0,0,0) 60%)', animation: 'floatGlow 18s ease-in-out infinite alternate' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-10 lg:px-14 py-10">
        <div className="xl:max-w-5xl 2xl:max-w-7xl mx-auto">
          {/* Header + Task Summary */}
          <div className="mb-6 flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-semibold text-gray-100 tracking-tight">
                {title}
              </h1>
              {description && (
                <div className="mt-4 p-4 md:p-5 rounded-xl bg-[#1c1c1c]/85 border border-[#323232] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {description}
                  </p>
                </div>
              )}
            </div>
            {/* Quick Tips */}
            <div className="hidden md:block min-w-[220px] rounded-xl bg-[#161616]/90 border border-[#2a2a2a] p-4 text-sm text-gray-200">
              <div className="font-medium text-gray-100 mb-2">Focus tips</div>
              <ul className="list-disc list-inside space-y-1 marker:text-[#ffc45a]">
                <li>Silence distractions</li>
                <li>Set a clear micro-goal</li>
                <li>Reward your focus</li>
              </ul>
            </div>
          </div>

          {/* Duration selectors */}
          <div className="mt-2 mb-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-gray-200 text-sm">Work (min)</label>
              <input
                type="number"
                min={1}
                max={180}
                value={workMinutes}
                disabled={isActive}
                onChange={(e) => {
                  const next = parseInt(e.target.value || '0', 10);
                  setWorkMinutes(Number.isNaN(next) ? 1 : Math.max(1, Math.min(180, next)));
                }}
                className="w-20 px-3 py-2 rounded-md bg-[#1c1c1c]/85 border border-[#323232] text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#6f99da]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-200 text-sm">Break (min)</label>
              <input
                type="number"
                min={1}
                max={90}
                value={breakMinutes}
                disabled={isActive}
                onChange={(e) => {
                  const next = parseInt(e.target.value || '0', 10);
                  setBreakMinutes(Number.isNaN(next) ? 1 : Math.max(1, Math.min(90, next)));
                }}
                className="w-20 px-3 py-2 rounded-md bg-[#1c1c1c]/85 border border-[#323232] text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#6f99da]"
              />
            </div>
          </div>

          {/* Timer + Controls */}
          <div className="mt-6 flex flex-col items-center justify-center min-h-[46vh] lg:min-h-[58vh]">
            {/* Circular progress timer */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 2xl:w-96 2xl:h-96">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${progressColor} ${progressDeg}deg, #2a2a2a ${progressDeg}deg)`
                }}
              />
              <div className="absolute inset-3 bg-[#111215] rounded-full border border-[#3a3a3a] shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                  {formatTime(time)}
                </div>
              </div>
            </div>

            <div className="text-xs my-6 tracking-wide uppercase text-gray-300 lg:text-xl 2xl:text-2xl">
                  {isBreak ? 'Break' : 'Work'}
                </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleStartPause}
                className="px-6 md:px-7 py-2.5 md:py-3 rounded-lg bg-gradient-to-br from-[#6f99da] to-[#91C8FF] text-[#0f172a] font-medium shadow-md hover:brightness-110 active:scale-[0.99] transition"
              >
                {!isActive ? 'Start' : isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetTimer}
                className="px-6 md:px-7 py-2.5 md:py-3 rounded-lg bg-[#232323] text-gray-100 border border-[#3a3a3a] hover:bg-[#2b2b2b] active:scale-[0.99] transition"
              >
                Reset
              </button>
            </div>

            {/* Helper text */}
            <div className="mt-4 text-sm text-gray-300">
              {!isActive && (
                <span>Set your durations above, then press Start when you're ready.</span>
              )}
              {isActive && !isBreak && (
                <span>Focus mode is on. We'll auto-start your break when time is up.</span>
              )}
              {isActive && isBreak && (
                <span>Break time. Relax and recharge.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatGlow {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -12px, 0) scale(1.04); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
}
