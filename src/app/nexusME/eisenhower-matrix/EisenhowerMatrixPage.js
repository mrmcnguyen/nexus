'use client';

import React, { useState } from 'react';

export default function EisenhowerMatrixPage() {
  const [tasks, setTasks] = useState({
    doNow: [],
    schedule: [],
    delegate: [],
    eliminate: []
  });

  const addTask = (quadrant, task) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [quadrant]: [...prevTasks[quadrant], task]
    }));
  };

  const Quadrant = ({ title, tasks, description, onAddTask, bgColor, textBoxColor, borderRoundness, border }) => {
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (newTask.trim()) {
        onAddTask(newTask);
        setNewTask(''); // Clear the input after adding the task
      }
    };

    return (
      <div className={`p-4 bg-[#2F2F2F] text-white ${borderRoundness} shadow-lg flex flex-col h-full ${border}`}>
        <h2 className="text-left lg:text-base 2xl:text-2xl text-gray-300">{title}</h2>
        <p className={`text-left lg:text-sm 2xl:text-base font-extralight text-gray-400 mb-4`}>{description}</p>
        <ul className="flex-grow overflow-y-auto max-h-64 mb-4 bg-[#585858]">
          {tasks.map((task, index) => (
            <li key={index} className={`bg-[${textBoxColor}] text-black p-2 my-2 rounded-full`}>
              {task}
            </li>
          ))}
        </ul>
        {/* <form onSubmit={handleSubmit} className="flex space-x-2 mt-auto">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task"
            className={`placeholder:text-gray-100 bg-[${textBoxColor}] p-3 border rounded-full w-full text-black focus-visible:outline-none`}
          />
          <button
            type="submit"
            className="bg-gray-800 rounded-full text-white px-4 py-2 hover:bg-gray-700"
          >
            Add
          </button>
        </form> */}
      </div>
    );
  };

  return (
    <div className="h-screen flex p-4 bg-[#171717] space-x-8">
      {/* Left side - Eisenhower Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 w-3/4 h-full">
        <Quadrant
          title="Urgent and Important"
          tasks={tasks.doNow}
          description="Do: Tasks with deadlines or consequences"
          onAddTask={(task) => addTask('doNow', task)}
          bgColor="bg-top-left"
          textBoxColor="#afcfc1"
          borderRoundness={"rounded-tl-lg"}
          border={"border-r border-b border-gray-500"}
        />
        <Quadrant
          title="Not Urgent but Important"
          tasks={tasks.schedule}
          description="Schedule: Tasks with unclear deadlines that contribute to long-term success"
          onAddTask={(task) => addTask('schedule', task)}
          bgColor="bg-top-right"
          textBoxColor="#f2a18d"
          borderRoundness={"rounded-tr-lg"}
          border={"border-b border-gray-500"}
        />
        <Quadrant
          title="Urgent but Not Important"
          tasks={tasks.delegate}
          description="Delegate: Tasks that must get done but don't require your specific skill set"
          onAddTask={(task) => addTask('delegate', task)}
          bgColor="bg-bottom-left"
          textBoxColor="#98b1e7"
          borderRoundness={"rounded-bl-lg"}
          border={"border-r border-gray-500"}
        />
        <Quadrant
          title="Not Urgent and Not Important"
          tasks={tasks.eliminate}
          description="Delete: Distractions and unnecessary tasks"
          onAddTask={(task) => addTask('eliminate', task)}
          bgColor="bg-bottom-right"
          textBoxColor="#f5898d"
          borderRoundness={"rounded-br-lg"}
        />
      </div>

      {/* Right Side - Sidebar */}
      <div className="w-1/4 bg-[#2F2F2F] shadow-lg rounded-lg p-6 h-full">
        <h2 className="lg:text-lg 2xl:text-2xl text-white font-light mb-4">Matrix Management</h2>
        {/* Additional functionality can be added here */}
        <p className="font-extralight lg:text-sm 2xl:text-base text-gray-400">
          What is the Eisenhower Matrix?
        </p>
      </div>
    </div>
  );
}
