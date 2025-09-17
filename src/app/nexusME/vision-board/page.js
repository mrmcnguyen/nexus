'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DM_Sans } from 'next/font/google';
import Link from 'next/link';

const dmSans = DM_Sans({ subsets: ['latin'] });

// Sample goals data - in a real app, this would come from a database
const initialGoals = [
  {
    id: 1,
    title: "Launch MVP",
    year: "2024",
    position: 0.15, // Position along timeline (0-1)
    color: "from-cyan-400 to-blue-500",
    glowColor: "shadow-cyan-500/50"
  },
  {
    id: 2,
    title: "Scale to 10K Users",
    year: "2025",
    position: 0.35,
    color: "from-emerald-400 to-green-500",
    glowColor: "shadow-emerald-500/50"
  },
  {
    id: 3,
    title: "Series A Funding",
    year: "2025",
    position: 0.55,
    color: "from-purple-400 to-pink-500",
    glowColor: "shadow-purple-500/50"
  },
  {
    id: 4,
    title: "Global Expansion",
    year: "2026",
    position: 0.75,
    color: "from-orange-400 to-red-500",
    glowColor: "shadow-orange-500/50"
  },
  {
    id: 5,
    title: "IPO",
    year: "2028",
    position: 0.95,
    color: "from-yellow-400 to-amber-500",
    glowColor: "shadow-yellow-500/50"
  }
];

export default function VisionBoard() {
  const [goals, setGoals] = useState(initialGoals);
  const [hoveredGoal, setHoveredGoal] = useState(null);
  const [currentPosition] = useState(0.1); // Current position on timeline

  // Add new goal functionality
  const addGoal = () => {
    const newGoal = {
      id: Date.now(),
      title: "New Goal",
      year: "2025",
      position: 0.5,
      color: "from-indigo-400 to-purple-500",
      glowColor: "shadow-indigo-500/50"
    };
    setGoals([...goals, newGoal]);
  };

  // Update goal title
  const updateGoalTitle = (id, newTitle) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, title: newTitle } : goal
    ));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${dmSans.className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-20 pb-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Vision Board
          </h1>
          <p className="text-gray-300 text-lg tracking-tight max-w-2xl pb-4 mx-auto">
            Productivity isn't just work work work. You need a clear vision of what you want to achieve. Visualize your journey from present to future. 
          </p>
          <p className="text-gray-300 text-sm tracking-tight max-w-2xl mx-auto">
            Everything starts with a vision.
            <br />
            <Link href="/" className="text-cyan-300 hover:text-cyan-400 hover:underline transition-colors duration-300">Learn about the importance of having visions and goals.</Link>
          </p>
        </motion.div>
      </div>

      {/* Today's Focus Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 flex justify-center mb-8"
      >
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl px-6 py-3 shadow-lg shadow-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-300 font-medium">Today's Focus: Building the Future</span>
          </div>
        </div>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative z-10 px-6">
        <div className="relative h-96 overflow-x-auto overflow-y-visible no-scrollbar">
          <div className="relative w-[2000px] h-full">
            {/* Timeline Base Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 transform -translate-y-1/2"
              style={{ originX: 0 }}
            />

            {/* Current Position Marker */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute top-1/2 transform -translate-y-1/2"
              style={{ left: `${currentPosition * 100}%` }}
            >
              <div className="relative">
                {/* Pulsing Core */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50"
                />
                {/* Outer Ring */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-6 h-6 border-2 border-cyan-400 rounded-full"
                />
                {/* Label */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-cyan-300 text-sm font-medium bg-slate-800/80 px-3 py-1 rounded-full border border-cyan-500/30">
                    NOW
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Goal Nodes */}
            <AnimatePresence>
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 50 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.2 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="absolute top-1/2 transform -translate-y-1/2"
                  style={{ left: `${goal.position * 100}%` }}
                  onMouseEnter={() => setHoveredGoal(goal.id)}
                  onMouseLeave={() => setHoveredGoal(null)}
                >
                  {/* Connection Line from Current Position */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
                    className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400/30 to-transparent transform -translate-y-1/2"
                    style={{ 
                      width: `${Math.abs(goal.position - currentPosition) * 100}%`,
                      left: goal.position < currentPosition ? `${goal.position * 100}%` : `${currentPosition * 100}%`,
                      transform: goal.position < currentPosition ? 'translateY(-50%) scaleX(-1)' : 'translateY(-50%)'
                    }}
                  />

                  {/* Goal Node */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative cursor-pointer group"
                  >
                    {/* Glow Effect */}
                    <motion.div
                      animate={hoveredGoal === goal.id ? { scale: 1.5, opacity: 0.3 } : { scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${goal.color} rounded-full blur-xl`}
                    />
                    
                    {/* Main Node */}
                    <div className={`relative w-16 h-16 bg-gradient-to-r ${goal.color} rounded-full shadow-lg ${goal.glowColor} flex items-center justify-center group-hover:shadow-2xl transition-all duration-300`}>
                      <motion.div
                        animate={hoveredGoal === goal.id ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </motion.div>
                    </div>

                    {/* Goal Title */}
                    <motion.div
                      animate={hoveredGoal === goal.id ? { y: -10, opacity: 1 } : { y: 0, opacity: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-center"
                    >
                      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-xl px-4 py-2 shadow-xl">
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoalTitle(goal.id, e.target.value)}
                          className="bg-transparent text-white text-sm font-medium text-center outline-none placeholder-gray-400 min-w-[80px]"
                          placeholder="Goal title"
                        />
                        <div className="text-xs text-gray-400 mt-1">{goal.year}</div>
                      </div>
                    </motion.div>

                    {/* Year Badge */}
                    <motion.div
                      animate={hoveredGoal === goal.id ? { y: 10, opacity: 1 } : { y: 0, opacity: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                    >
                      <span className="text-xs text-gray-300 bg-slate-700/80 px-2 py-1 rounded-full border border-slate-600/50">
                        {goal.year}
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Goal Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="relative z-10 flex justify-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addGoal}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Goal</span>
        </motion.button>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="relative z-10 text-center mt-8 px-6"
      >
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Hover over goals to see details • Click to edit titles • Drag to reorder (coming soon)
        </p>
      </motion.div>
    </div>
  );
}
