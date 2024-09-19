'use client'
import { useState } from 'react';
import Image from 'next/image';

export default function OneThreeFiveFramework() {
  // State to store the user's tasks
  const [tasks, setTasks] = useState({
    bigTask: '',
    mediumTasks: ['', '', ''],
    smallTasks: ['', '', '', '', ''],
  });

  // Function to handle input changes
  const handleTaskChange = (category, index, value) => {
    if (category === 'bigTask') {
      setTasks({ ...tasks, bigTask: value });
    } else {
      const updatedTasks = [...tasks[category]];
      updatedTasks[index] = value;
      setTasks({ ...tasks, [category]: updatedTasks });
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-5xl text-black font-normal text-left lg:text-5xl md:text-3xl 2xl:text-7xl">1-3-5 Productivity Framework</h1>
  <button className="mt-8 mb-8 inline-flex text-gray-400 items-center lg:text-xl" onClick={() => window.open("https://www.timegram.io/blog/1-3-5-rule")}>
  Unsure of how to use this?
  <Image
    src="/newTab.svg"
    className="ml-2"
    width={14}
    height={14}
    priority
  />
</button>

      {/* Big Task */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">1 Big Task</h2>
        <input
          type="text"
          value={tasks.bigTask}
          onChange={(e) => handleTaskChange('bigTask', null, e.target.value)}
          placeholder="Enter your most important task"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      {/* Medium Tasks */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-500">3 Medium Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tasks.mediumTasks.map((task, index) => (
            <input
              key={index}
              type="text"
              value={task}
              onChange={(e) => handleTaskChange('mediumTasks', index, e.target.value)}
              placeholder={`Enter medium task ${index + 1}`}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Small Tasks */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-500">5 Small Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tasks.smallTasks.map((task, index) => (
            <input
              key={index}
              type="text"
              value={task}
              onChange={(e) => handleTaskChange('smallTasks', index, e.target.value)}
              placeholder={`Enter small task ${index + 1}`}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
