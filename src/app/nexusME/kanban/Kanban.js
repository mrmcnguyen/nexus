'use client'

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function KanbanComponent(){
    const initialTasks = [
        { id: 1, title: 'Link Dataset to application backend', status: 'To Do' },
        { id: 2, title: 'Task 2', status: 'In Progress' },
        { id: 3, title: 'Task 3', status: 'Done' },
    ];

    const [tasks, setTasks] = useState(initialTasks);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); 
    const [dropdownTaskId, setDropdownTaskId] = useState(null);

    // Variables for task count
    const dropdownRef = useRef(null);

    // Handle moving tasks to a new status
    const handleMoveTask = (taskId, newStatus) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
    };

    // Add a new task to "To Do"
    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            const newTask = {
                id: tasks.length + 1,
                title: newTaskTitle,
                status: 'To Do'
            };
            setTasks([...tasks, newTask]);
            setNewTaskTitle(''); // Clear input after adding task
        }
    };

    // Handle pressing Enter to add the task
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

     // Handle task click to open modal
     const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };
    
    const toggleDropdown = (taskId) => {
        setDropdownTaskId(dropdownTaskId === taskId ? null : taskId); // Toggle between null and taskId
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownTaskId(null); // Close dropdown if click is outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="p-8 pt-4 min-h-screen flex flex-col bg-[#171717]">
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row items-center">
                    <h1 className="text-5xl text-gray-300 font-normal text-left lg:text-4xl md:text-3xl 2xl:text-4xl">Kanban Board</h1>
                    <span className="flex flex-row items-center m-4 border border-[#2F2F2F] bg-[#2F2F2F] text-gray-400 text-xs rounded-2xl px-2"><Image
                                          src="/synced.svg"
                                          width={14}
                                          className="m-1"
                                          height={14}
                                          alt="t"
                                          priority
                                      />Synced</span>
                    </div>
                <div className="flex flex-row space-x-4">
        <button className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]">
            <Image
                src="/list.svg"
                style={{ filter: 'invert(1)' }}
                className="mr-2"  
                width={14}
                alt="t"
                height={14}
                priority
            />
            View as List
        </button>
        <button className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]">
            <Image
                src="/team.svg" 
                style={{ filter: 'invert(1)' }}
                className="mr-2"  
                width={14}
                alt="team"
                height={14}
                priority
            />
            View Team Kanban Board
        </button>
    </div>
            </div>

            {/* Task Input for "To Do"
            <div className="flex flex-row mb-6 items-center">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter new task..."
                    className="p-2 bg-[#313131] border border-gray-500 focus-visible:outline-none rounded mr-2 flex-grow text-gray-300"
                />
                <button
                    onClick={handleAddTask}
                    className="bg-[#6f99da] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Add Task
                </button>
            </div> */}

            {/* Kanban Board */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 flex-grow">
                
                {/* To Do Column */}
                <div className="bg-[#1f1f1f] p-4 border border-[#2F2F2F] rounded-lg flex flex-col h-full overflow-y-auto">
                <div className="flex flex-row items-center mb-4">
                    <Image
                            src="/toDo.svg"
                            className="mr-2"  
                            width={14}
                            alt="t"
                            height={14}
                            priority
                        />
                    <h2 className="lg:text-lg 2xl:text-xl text-gray-300 font-light text-left">To Do</h2>
                    </div>
                    <div className="flex-grow">
                    {getTasksByStatus('To Do').map((task) => (
                      <div 
                          key={task.id} 
                          className="p-4 bg-[#292929] rounded-lg shadow mb-4 group hover:bg-[#414141] transition duration-200 ease-in-out"
                      >
                          <div className="flex flex-row justify-between">
                              <p className="flex items-center pl-2 border-l-4 border-red-500 text-gray-200">{task.title}</p>
                              {/* Hide the image by default and show on hover */}
                              <div className="relative" ref={dropdownRef}>
                                  <button onClick={() => toggleDropdown(task.id)} className="bg-[#414141] opacity-0 group-hover:opacity-100 p-2 rounded-lg transition">
                                      <Image
                                          src="/options.svg"
                                          width={14}
                                          className="filter invert"
                                          height={14}
                                          alt="t"
                                          priority
                                      />
                                  </button>
                                  {dropdownTaskId === task.id && (
                                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                          <button className="block w-full px-4 py-2 text-left text-black rounded-t-lg hover:bg-gray-100">Edit</button>
                                          <button className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100">Delete</button>
                                      </div>
                                  )}
                              </div>
                          </div>
                          <button
                              onClick={() => handleMoveTask(task.id, 'In Progress')}
                              className="mt-2 text-sm text-blue-500"
                          >
                              Move to In Progress
                          </button>
                      </div>
                  ))}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-[#1f1f1f] border border-[#2F2F2F] rounded-lg p-4 flex flex-col h-full overflow-y-auto">
                    <div className="flex flex-row items-center mb-4">
                    <Image
                            src="/progress.svg"
                            className="mr-2"  
                            width={14}
                            alt="t"
                            height={14}
                            priority
                        />
                        <h2 className="lg:text-lg 2xl:text-xl font-light text-left text-gray-300">In Progress</h2>
                        </div>
                    <div className="flex-grow">
                        {getTasksByStatus('In Progress').map(task => (
                            <div 
                            key={task.id} 
                            className="p-4 bg-[#292929] rounded-lg shadow mb-4 group hover:bg-[#414141] transition duration-200 ease-in-out"
                        >
                            <div className="flex flex-row justify-between">
                            <p className="flex items-center pl-2 border-l-4 border-blue-500 text-gray-200">{task.title}</p>
                                {/* Hide the image by default and show on hover */}
                                <div className="bg-[#707070] p-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out rounded-lg">
                              <Image
                                    src="/options.svg"
                                    className="opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"  
                                    width={14}
                                    height={14}
                                    alt="t"
                                    priority
                                />
                                </div>
                            </div>
                                <button
                                    onClick={() => handleMoveTask(task.id, 'Done')}
                                    className="mt-2 text-sm text-blue-500"
                                >
                                    Move to Done
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Done Column */}
                <div className="bg-[#1f1f1f] p-4 border border-[#2F2F2F] rounded-lg flex flex-col h-full overflow-y-auto">
                <div className="flex flex-row items-center mb-4">
                    <Image
                            src="/doneCol.svg"
                            className="mr-2"  
                            width={14}
                            alt="t"
                            height={14}
                            priority
                        />
                    <h2 className="lg:text-lg 2xl:text-xl font-light text-left text-gray-300">Done</h2>
                    </div>
                    <div className="flex-grow">
                        {getTasksByStatus('Done').map(task => (
                            <div 
                            key={task.id} 
                            className="p-4 bg-[#292929] rounded-lg shadow mb-4 group hover:bg-[#414141] transition duration-200 ease-in-out"
                        >
                            <div className="flex flex-row justify-between">
                            <p className="flex items-center pl-2 border-l-4 border-emerald-500 text-gray-200">{task.title}</p>
                                {/* Hide the image by default and show on hover */}
                                <div className="bg-[#707070] p-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out rounded-lg">
                              <Image
                                    src="/options.svg"
                                    className="opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"  
                                    width={14}
                                    alt="t"
                                    height={14}
                                    priority
                                />
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed text-black inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <button 
                            onClick={closeModal} 
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
