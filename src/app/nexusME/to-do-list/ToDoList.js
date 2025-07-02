'use client';
import { useState, useRef, useEffect } from 'react';

export default function TodoList() {
  const [task, setTask] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef(null);

  // Start a task
  const startTask = (taskObj) => {
    setActiveTask(taskObj);
    if (taskObj.timeLimit) {
      setRemaining(taskObj.timeLimit * 60); // minutes to seconds
    } else {
      setRemaining(0);
    }
  };

  // Stop the active task
  const stopTask = () => {
    setActiveTask(null);
    setRemaining(0);
    clearInterval(timerRef.current);
  };

  // Timer effect
  useEffect(() => {
    if (activeTask && activeTask.timeLimit) {
      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [activeTask]);

  // Add a new task
  const addTask = () => {
    if (task.trim() !== '') {
      setTasks([
        ...tasks,
        {
          text: task,
          timeLimit: timeLimit ? parseInt(timeLimit) : null,
          started: false,
        },
      ]);
      setTask('');
      setTimeLimit('');
    }
  };

  // Handle pressing Enter to add the task
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Remove a task
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Main UI
  if (activeTask) {
    // Minimal focus mode
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#18181b] text-white transition-all duration-300">
        <div className="flex flex-col items-center space-y-8 p-8 rounded-xl shadow-2xl bg-[#23232b] border border-[#333]">
          <h2 className="text-3xl font-bold mb-2 text-center">{activeTask.text}</h2>
          {activeTask.timeLimit ? (
            <div className="text-6xl font-mono tracking-widest mb-4">
              {`${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`}
            </div>
          ) : (
            <div className="text-lg text-gray-400 mb-4">No time limit</div>
          )}
          <button
            onClick={stopTask}
            className="px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-lg shadow transition"
          >
            Stop
          </button>
        </div>
      </div>
    );
  }

  // Task creation and list UI
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-[#23232b] to-[#18181b]">
      <h1 className="text-5xl text-white font-black mb-8 text-center drop-shadow-lg">To-Do List</h1>
      <div className="bg-[#23232b] border border-[#333] shadow-2xl rounded-xl p-8 w-full max-w-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-1 p-3 text-white bg-[#18181b] border border-[#444] rounded-lg focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            placeholder="Add a new task..."
            onKeyDown={handleKeyDown}
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <input
            type="number"
            min="1"
            className="w-32 p-3 text-white bg-[#18181b] border border-[#444] rounded-lg focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            placeholder="Time (min)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow"
          >
            Add
          </button>
        </div>
        <ul className="space-y-4">
          {tasks.length === 0 && (
            <li className="text-gray-400 text-center py-8">No tasks yet. Add one above!</li>
          )}
          {tasks.map((t, idx) => (
            <li key={idx} className="flex items-center justify-between p-4 bg-[#18181b] border border-[#444] rounded-lg shadow">
              <div>
                <span className="text-white font-medium text-lg">{t.text}</span>
                {t.timeLimit && (
                  <span className="ml-3 px-2 py-1 text-xs rounded bg-blue-900 text-blue-300 border border-blue-700">{t.timeLimit} min</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startTask(t)}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                >
                  Start Now
                </button>
                <button
                  onClick={() => deleteTask(idx)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
