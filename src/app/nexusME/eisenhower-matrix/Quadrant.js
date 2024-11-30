'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { addEisenhowerTask } from '../../../lib/db/queries';
import { fetchAllTasks } from '../../../lib/db/queries';

export default function Quadrant({
  title,
  tasks,
  description,
  onAddTask,
  bgColor,
  textBoxColor,
  borderRoundness,
  border,
  userID,
  quadrant,
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
      const result = await addEisenhowerTask(userID, newTask, "eisenhower", quadrant);

      if (result.success) {
        onAddTask(newTask); // Update the UI if the task was added successfully
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
      className={`p-4 bg-[#1f1f1f] text-white ${borderRoundness} shadow-lg flex flex-col h-full ${border}`}
    >
      <h2 className="text-left lg:text-base 2xl:text-2xl text-gray-300">{title}</h2>
      <p className="text-left lg:text-sm 2xl:text-lg font-extralight text-gray-400 mb-4">
        {description}
      </p>
      {/* Task List */}
      <ul
        ref={ulRef}
        style={
          ulHeight !== null
            ? { height: `${ulHeight}px`, overflowY: 'auto' }
            : { display: 'flex', flexGrow: 1 }
        }
        className="p-2"
        onMouseEnter={() => setIsHovered(true)} // Show "Add Task" when hovered
        onMouseLeave={() => setIsHovered(false)} // Hide "Add Task" when not hovered
      >
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`bg-[#292929] text-gray-400 p-2 my-2 rounded-lg px-4 border border-[#454545]`}
          >
            {task}
          </li>
        ))}

        {/* Conditionally render input box or button */}
        {isEditing ? (
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress} // Handle Enter key press
            onBlur={() => setIsEditing(false)} // Exit editing when the input loses focus
            className="p-2 mt-2 rounded-md bg-[#292929] text-gray-400 w-full focus-visible:outline-none"
            placeholder="Add new task..."
          />
        ) : (
          <button
            className={`flex flex-row items-center w-full text-gray-400 p-2 mt-2 transition-opacity duration-300 ease-in-out ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsEditing(true)} // Switch to input box on click
          >
            <Image
              src="/plus.svg"
              className="mr-2"
              width={14}
              alt="t"
              height={14}
              priority
            />
            Add Task
          </button>
        )}
      </ul>
    </div>
  );
}
