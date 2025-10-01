'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { addEisenhowerTaskAction, getEisenhowerTaskByIDAction } from '../../eisenhower-actions';
import LabelBadge from '../../../../components/LabelBadge';

export default function Quadrant({
  title,
  tasks,
  description,
  onAddTask,
  onTaskClick,
  borderRoundness,
  border,
  userID,
  quadrant,
  onDragOver,
  onDrop,
  onDragEnter,
  onDragLeave,
  dragOverColumn
}) {
  const [newTask, setNewTask] = useState('');
  const [ulHeight, setUlHeight] = useState(null); // State to hold the fixed height
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to toggle between button and input
  const ulRef = useRef(null);

  // Function to handle resizing
  const updateHeight = () => {
    if (ulRef.current && ulHeight === null) {
      // Capture the natural height of the ul before setting any styles
      setUlHeight(ulRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    // Initial height capture
    updateHeight();
    // Add the resize event listener
    window.addEventListener('resize', updateHeight);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [ulHeight]); // Only run once when ulHeight is null or changed

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const result = await addEisenhowerTaskAction(userID, newTask, "eisenhower", quadrant);

      if (result.success) {
        const taskID = result.data.task_id;
        const updatedTask = await getEisenhowerTaskByIDAction(taskID, userID); // Query the database for updated tasks
        onAddTask(updatedTask); // Update the parent component's task state
        setNewTask('');
      } else {
        console.error('Failed to add task:', result.error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e); // Trigger the handleSubmit when Enter is pressed
    }
  };

  return (
    <div
      className={`p-6 bg-neutral-950 text-white ${borderRoundness} shadow-2xl flex flex-col h-full border border-[#333] transition-colors`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2 className="text-lg tracking-tight font-medium text-gray-100 mb-1">{title}</h2>
      <p className="text-sm tracking-tight font-light text-gray-400 mb-4">{description}</p>
      {/* Task List */}
      <ul
        ref={ulRef}
        style={
          ulHeight !== null
            ? { height: `${ulHeight}px`, overflowY: 'auto' }
            : { display: 'flex', flexGrow: 1 }
        }
        className={`space-y-2 p-0 ${dragOverColumn === quadrant ? 'bg-[#232323] transition-colors' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        {tasks.map((task, index) => {
          const isDone = task.status === true || task.tasks?.status === true;
          return (
            <li
              key={index}
              className={`p-3 rounded-md border text-sm tracking-tight font-normal shadow transition-colors cursor-pointer ${isDone
                ? 'bg-green-900/30 text-green-300 border-green-600/40 line-through opacity-80'
                : 'bg-neutral-900 text-gray-300 border-neutral-800 hover:bg-neutral-800'}
              `}
              onClick={() => onTaskClick(task)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>
                    {task?.tasks?.title ? (
                      task.tasks.title
                    ) : task?.title ? (
                      task.title
                    ) : (
                      JSON.stringify(task)
                    )}
                  </span>
                  {isDone && (
                    <span className="ml-2 inline-flex items-center text-[10px] px-2 py-[2px] rounded-full bg-green-600/20 border border-green-600/40 text-green-300 align-middle">
                      Done
                    </span>
                  )}
                </div>
                
                {/* Labels */}
                {task.tasks?.taskLabels && task.tasks.taskLabels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.tasks.taskLabels.map((labelItem) => (
                      <LabelBadge
                        key={labelItem.label_id}
                        label={labelItem.labels}
                        size="xs"
                        className="text-xs"
                      />
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
        {/* Conditionally render input box or button */}
        {isEditing ? (
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={() => setIsEditing(false)}
            className="p-3 mt-2 text-sm rounded-lg bg-[#2a2a2a] border border-neutral-800 text-gray-300 w-full focus:outline-none focus:border-blue-500 placeholder:text-gray-500 transition-colors"
            placeholder="Add new task..."
            autoFocus
          />
        ) : (
          <button
            className={`flex flex-row items-center border-2 border-dashed border-neutral-800 hover:border-neutral-700 text-sm w-full text-gray-200 p-3 mt-2 rounded-lg hover:bg-[#232323] transition-colors opacity-90 hover:opacity-100`}
            onClick={() => setIsEditing(true)}
          >
            <Image
              src="/plus.svg"
              className="mr-2"
              width={16}
              alt="Add"
              height={16}
              priority
            />
            Add Task
          </button>
        )}
      </ul>
    </div>
  );
}
