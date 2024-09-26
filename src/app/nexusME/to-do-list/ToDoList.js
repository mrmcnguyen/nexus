'use client';
import { useState } from 'react';

export default function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  // Handle pressing Enter to add the task
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gray-100">
      <h1 className="text-5xl text-black font-normal text-left mb-8 lg:text-5xl md:text-3xl 2xl:text-7xl">To-Do List</h1>
      <div className="bg-white shadow-lg w-full rounded-lg p-8 w-full">
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Add a new task"
            onKeyDown={handleKeyDown}
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button
            onClick={addTask}
            className="ml-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        <ul className="space-y-4">
          {tasks.map((task, index) => (
            <li key={index} className={`flex items-center justify-between p-4 border rounded-lg ${task.completed ? 'bg-green-100' : 'bg-white'}`}>
              <span className={`flex-grow text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.text}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleComplete(index)}
                  className={`px-4 py-2 rounded-lg ${task.completed ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-green-500 hover:bg-green-600'} transition text-white`}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
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
