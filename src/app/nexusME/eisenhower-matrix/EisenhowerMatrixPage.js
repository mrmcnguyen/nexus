'use client';

import React, { useState } from 'react';

export default function EisenhowerMatrix() {
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

  const Quadrant = ({ title, tasks, description, onAddTask, bgColor, textBoxColor }) => {
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (newTask.trim()) {
        onAddTask(newTask);
        setNewTask(''); // Clear the input after adding the task
      }
    };

    return (
      <div className={`p-6 ${bgColor} text-white shadow-lg h-full`}>
        <h2 className="text-center text-2xl font-semibold">{title}</h2>
        <p className="text-center text-lg font-light mb-4">{description}</p>
        {/* Task list with scrollable overflow */}
        <ul className="mb-4 h-96 overflow-y-auto">
          {tasks.map((task, index) => (
            <li key={index} className={`${textBoxColor} text-black p-2 my-2 rounded-full p-4`}>
              {task}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="flex space-x-2 mt-auto">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task"
            className={`placeholder:text-gray-100 ${textBoxColor} p-3 border rounded-full w-full mt-auto text-black focus-visible:outline-none`}
          />
          <button
            type="submit"
            className="bg-gray-800 rounded-full text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Add
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="relative h-max flex flex-col items-center text-left w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">
        <Quadrant
          title="Urgent and Important"
          tasks={tasks.doNow}
          description={"Do: Tasks with deadlines or consequences"}
          onAddTask={(task) => addTask('doNow', task)}
          bgColor="bg-[#61a184] rounded-tl-lg"
          textBoxColor={"bg-[#afcfc1]"}
        />
        <Quadrant
          title="Not Urgent but Important"
          tasks={tasks.schedule}
          description={"Schedule: Tasks with unclear deadlines that contribute to long-term success"}
          onAddTask={(task) => addTask('schedule', task)}
          bgColor="bg-[#ef8d75] rounded-tr-lg"
          textBoxColor={"bg-[#f2a18d]"}
        />
        <Quadrant
          title="Urgent but Not Important"
          tasks={tasks.delegate}
          description={"Delegate: Tasks that must get done but don't require your specific skill set"}
          onAddTask={(task) => addTask('delegate', task)}
          bgColor="bg-[#4672d3] rounded-bl-lg"
          textBoxColor={"bg-[#98b1e7]"}
        />
        <Quadrant
          title="Not Urgent and Not Important"
          tasks={tasks.eliminate}
          description={"Delete: Distractions and unnecessary tasks"}
          onAddTask={(task) => addTask('eliminate', task)}
          bgColor="bg-[#f3676b] rounded-br-lg"
          textBoxColor={"bg-[#f5898d]"}
        />
      </div>
    </div>
  );
}
