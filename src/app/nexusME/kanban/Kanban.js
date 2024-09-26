'use client'

import { useState } from "react";
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

    return (
        <div className="p-8 min-h-screen flex flex-col">
            <div className="flex flex-row justify-between items-center mb-8">
                <h1 className="text-5xl text-black font-normal text-left lg:text-5xl md:text-3xl 2xl:text-7xl">Kanban Board</h1>
                <button className="flex flex-row text-xl items-center px-4 py-2 mr-2 text-gray-600 transition duration-200 border border-[#c2c8d0] align-middle font-semibold rounded-lg hover:bg-gray-300">
                    <Image
                        src="/list.svg"
                        className="mr-2"  
                        width={14}
                        height={14}
                        priority
                    />
                    View as List
                </button>
            </div>

            {/* Task Input for "To Do" */}
            <div className="flex flex-row mb-6 items-center">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter new task..."
                    className="p-2 border border-gray-300 rounded mr-2 flex-grow text-black"
                />
                <button
                    onClick={handleAddTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Add Task
                </button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 flex-grow">
                
                {/* To Do Column */}
                <div className="bg-gray-100 p-4 rounded-lg flex flex-col h-full overflow-y-auto">
                    <h2 className="text-xl text-black font-semibold text-center mb-4">To Do</h2>
                    <div className="flex-grow">
                    {getTasksByStatus('To Do').map((task) => (
                      <div 
                          key={task.id} 
                          className="p-4 bg-white rounded shadow mb-4 group hover:bg-gray-200 transition duration-200 ease-in-out"
                          onClick={() => handleTaskClick(task)}
                      >
                          <div className="flex flex-row justify-between">
                              <p className="text-black">{task.title}</p>
                              {/* Hide the image by default and show on hover */}
                              <div className="bg-gray-100 p-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out rounded-lg">
                              <Image
                                    src="/options.svg"
                                    className="opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"  
                                    width={14}
                                    height={14}
                                    priority
                                />
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
                <div className="bg-yellow-100 p-4 rounded-lg flex flex-col h-full overflow-y-auto">
                    <h2 className="text-xl font-semibold text-center text-black mb-4">In Progress</h2>
                    <div className="flex-grow">
                        {getTasksByStatus('In Progress').map(task => (
                            <div 
                            key={task.id} 
                            className="p-4 bg-yellow-50 rounded shadow mb-4 group hover:bg-yellow-200 transition duration-200 ease-in-out"
                            onClick={() => handleTaskClick(task)}
                        >
                            <div className="flex flex-row justify-between">
                                <p className="text-black">{task.title}</p>
                                {/* Hide the image by default and show on hover */}
                                <div className="bg-yellow-100 p-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out rounded-lg">
                              <Image
                                    src="/options.svg"
                                    className="opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"  
                                    width={14}
                                    height={14}
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
                <div className="bg-green-100 p-4 rounded-lg flex flex-col h-full overflow-y-auto">
                    <h2 className="text-xl font-semibold text-center text-black mb-4">Done</h2>
                    <div className="flex-grow">
                        {getTasksByStatus('Done').map(task => (
                            <div 
                            key={task.id} 
                            className="p-4 bg-green-50 rounded shadow mb-4 group hover:bg-green-200 transition duration-200 ease-in-out"
                            onClick={() => handleTaskClick(task)}
                        >
                            <div className="flex flex-row justify-between">
                                <p className="text-black">{task.title}</p>
                                {/* Hide the image by default and show on hover */}
                                <div className="bg-green-100 p-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out rounded-lg">
                              <Image
                                    src="/options.svg"
                                    className="opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"  
                                    width={14}
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
