'use client'

import { useState } from "react";
import Image from "next/image";

export default function KanbanComponent(){
    const initialTasks = [
        { id: 1, title: 'Task 1', status: 'To Do' },
        { id: 2, title: 'Task 2', status: 'In Progress' },
        { id: 3, title: 'Task 3', status: 'Done' },
    ];

    const [tasks, setTasks] = useState(initialTasks);
    const [newTaskTitle, setNewTaskTitle] = useState('');

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

    const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

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
                    placeholder="Enter new task..."
                    className="p-2 border border-gray-300 rounded mr-2 flex-grow"
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
                        {getTasksByStatus('To Do').map(task => (
                            <div key={task.id} className="p-4 bg-white rounded shadow mb-4">
                                <p className="text-black">{task.title}</p>
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
                            <div key={task.id} className="p-4 bg-white rounded shadow mb-4">
                                <p className="text-black">{task.title}</p>
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
                            <div key={task.id} className="p-4 bg-white rounded shadow mb-4">
                                <p className="text-black">{task.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
