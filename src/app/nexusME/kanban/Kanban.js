'use client'

import { useState } from "react"
import Image from "next/image";

export default function KanbanComponent(){
    const initialTasks = [
        { id: 1, title: 'Task 1', status: 'To Do' },
        { id: 2, title: 'Task 2', status: 'In Progress' },
        { id: 3, title: 'Task 3', status: 'Done' },
      ];
    
      const [tasks, setTasks] = useState(initialTasks);
    
      const handleMoveTask = (taskId, newStatus) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
      };
    
      const getTasksByStatus = (status) => tasks.filter(task => task.status === status);
    
      return (
        <div className="p-8 h-screen ">
          <div className="flex flex-row justify-between items-center mb-8 ">
            <h1 className="text-5xl text-black font-bold text-left lg:text-7xl md:text-3xl">Kanban Board</h1>
            <button className="flex flex-row text-xl items-center px-4 py-2 mr-2 h-1/2 text-gray-600 transition duration-200 border border-[#c2c8d0] align-middle font-semibold rounded-lg hover:bg-gray-300">
            <Image
    src="/list.svg"
    className="mr-2"  
    width={14}
    height={14}
    priority
  />View as List
            </button>
            </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 h-full">
            
            {/* To Do Column */}
            <div className="bg-gray-100 p-4 rounded-lg ">
              <h2 className="text-xl text-black font-semibold text-center mb-4">To Do</h2>
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
            
            {/* In Progress Column */}
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-center text-black mb-4">In Progress</h2>
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
            
            {/* Done Column */}
            <div className="bg-green-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-center text-black mb-4">Done</h2>
              {getTasksByStatus('Done').map(task => (
                <div key={task.id} className="p-4 bg-white rounded shadow mb-4">
                  <p className="text-black">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
}