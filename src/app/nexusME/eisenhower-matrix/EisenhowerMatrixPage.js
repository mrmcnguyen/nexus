'use client';

import React, { useEffect, useState } from 'react';
import Quadrant from './Quadrant';
import { createClient } from '../../../../supabase/client';
import { addUnallocatedEisenhowerTask, getEisenhowerTasks, getEisenhowerTaskByID, allocateEisenhowerTask, finishEisenhowerTask } from '../../../lib/db/queries';
import HelpModal from './helpModal';
import Image from 'next/image';
import TaskModal from './taskModal'
import Loading from './loading';

export default function EisenhowerMatrixPage() {
  const [tasks, setTasks] = useState({
    do: [],
    schedule: [],
    delegate: [],
    eliminate: [],
  });

  const [unallocatedTasks, setUnallocatedTasks] = useState([]);

  const [allTasks, setAllTasks] = useState(null); // Initialize as null to signify loading state
  const [userID, setUserID] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const [helpClick, setHelpClick] = useState(false);
  const [deletionNotification, setDeletionNotification] = useState(null);
  const [newTask, setNewTask] = useState('');

  const supabase = createClient();

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (user) {
        setUserID(user.user.id);
      } else {
        console.error('Error while fetching user ID: ', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch all Eisenhower tasks
  useEffect(() => {
    const fetchAllEisenhowerTasks = async () => {
      if (userID) {
        const result = await getEisenhowerTasks(userID);
        setAllTasks(result || {}); // Safeguard against null
        setIsLoading(false); // Stop loading when data is fetched
      }
    };

    fetchAllEisenhowerTasks();
  }, [userID]);

  // Update tasks whenever allTasks changes
  useEffect(() => {
    if (allTasks) {
      const updatedTasks = {
        do: [],
        schedule: [],
        delegate: [],
        eliminate: [],
      };
      const updatedUnallocatedTasks = [];

      allTasks.forEach((task) => {
        if (task.matrix_type && updatedTasks[task.matrix_type]) {
          updatedTasks[task.matrix_type].push(task);
        } else {
          updatedUnallocatedTasks.push(task);
        }
      });

      setTasks(updatedTasks);
      setUnallocatedTasks(updatedUnallocatedTasks);
    }
  }, [allTasks]);

  const addTask = (quadrant, task) => {
    setTasks((prevTasks) => {
      const updatedTasks = {
        ...prevTasks,
        [quadrant]: [...prevTasks[quadrant], task],
      };
      return updatedTasks;
    });
  };

  const removeTask = (quadrant, taskToRemove) => {
    console.log(quadrant);
    console.log(taskToRemove);
    setTasks((prevTasks) => ({
      ...prevTasks,
      [quadrant]: prevTasks[quadrant].filter((t) => {
        // Compare task IDs, handling both nested and flat structures
        const taskId = t.tasks?.task_id || t.task_id;
        const removeTaskId = taskToRemove.tasks?.task_id || taskToRemove.task_id;
        return taskId !== removeTaskId;
      }),
    }));
  };

  const handleDrop = async(quadrant, e) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData('task'));

    const res = await allocateEisenhowerTask(task.task_id || task.tasks?.task_id, quadrant);
    if (!res) {
      console.error('Error allocating task. Please check logs.');
    }

    let newTask = await getEisenhowerTaskByID(task.task_id || task.tasks?.task_id, userID);

    // Add task to quadrant and remove from unallocated tasks
    addTask(quadrant, newTask);
        
    setUnallocatedTasks((prevTasks) =>
      prevTasks.filter((t) => {
        const taskId = t.task_id || t.tasks?.task_id;
        const removeTaskId = newTask.task_id || newTask.tasks?.task_id;
        return taskId !== removeTaskId;
      })
    );
  };

  const handleFinishTask = async (task) => {
    console.log(task);
    finishEisenhowerTask(task.task_id || task.tasks?.task_id);
  
    const finishedTask = await getEisenhowerTaskByID(task.task_id || task.tasks?.task_id, userID);
  
    // Determine the current quadrant of the task
    const currentQuadrant = Object.keys(tasks).find(quadrant => 
      tasks[quadrant].some(t => (t.task_id || t.tasks?.task_id) === (task.task_id || task.tasks?.task_id))
    );
  
    if (currentQuadrant) {
      // Remove the task from its current quadrant
      setTasks(prevTasks => ({
        ...prevTasks,
        [currentQuadrant]: prevTasks[currentQuadrant].filter(
          t => (t.task_id || t.tasks?.task_id) !== (task.task_id || task.tasks?.task_id)
        )
      }));
    }
  
    // Update the overall allTasks state
    setAllTasks(prevAllTasks => 
      prevAllTasks.map(t => 
        (t.task_id || t.tasks?.task_id) === (finishedTask.task_id || finishedTask.tasks?.task_id) 
          ? finishedTask 
          : t
      )
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      try {
        const res = await addUnallocatedEisenhowerTask(userID, 'eisenhower', newTask);
  
        if (res.success) {
          // Fetch the newly added task
          const taskID = res.data.task_id;
          const updatedTask = await getEisenhowerTaskByID(taskID, userID);
          
          setUnallocatedTasks((prevTasks) => [...prevTasks, updatedTask]);
          // Clear the input
          setNewTask('');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e); // Trigger handleSubmit when Enter is pressed
    }
  };

  // Function to show deletion notification
  const showDeletionNotification = (task) => {
    setDeletionNotification(task);
    
    // Clear notification after 3 seconds
    const timer = setTimeout(() => {
      setDeletionNotification(null);
    }, 3000);

    // Cleanup the timer if component unmounts
    return () => clearTimeout(timer);
  };

  // Show loading spinner or placeholder while fetching tasks
  if (isLoading || !allTasks) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex p-4 bg-[#171717] space-x-8 relative">
      {/* Deletion Notification */}

      <style jsx global>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
      `}</style>

      <div className="w-1/4 bg-[#1f1f1f] border border-[#2F2F2F] shadow-lg rounded-lg p-4 h-full">
        <div className='flex flex-row justify-between align-center'>
        <h2 className="lg:text-lg 2xl:text-2xl text-gray-300 font-light">Backlog</h2>
        <button className='flex flex-row items-center text-[#505050] lg:text-xs 2xl:text-sm user-select: none;' onClick={() => setHelpClick(true)}>
          Help
        <Image
          src="/help.svg"
          className="mx-2"  
          width={14}
          alt="Help"
          height={14}
          priority
      />
        </button>
      <HelpModal isVisible={helpClick} closeModal={() => setHelpClick(false)} />
        </div>
        <input 
          className='bg-[#292929] w-full lg:text-sm 2xl:text-base text-gray-400 p-2 my-2 rounded-lg px-4 focus-visible:outline-none placeholder:text-gray-500'
          placeholder='Enter everything you need done...'
          onKeyDown={handleKeyPress} // Handle Enter key press
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />

        {unallocatedTasks.map((task, index) => (
          <div
            key={index}
            className="bg-[#292929] lg:text-sm 2xl:text-base text-gray-400 p-2 my-2 rounded-lg px-4 border border-[#454545] hover:bg-[#414141] transition duration-200 ease-in-out"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))}
          >
            {task.tasks?.title || task.title || 'Untitled Task'}
          </div>
        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-3/4 h-full">
      <TaskModal
        isVisible={isModalVisible}
        closeModal={() => setModalVisible(false)}
        task={selectedTask}
        onDeleteTask={(quadrant, task) => {
          removeTask(quadrant, task);
          showDeletionNotification(task);
          setModalVisible(false);
        }}
        onFinishTask={(task) => handleFinishTask(task)}
      />

      {deletionNotification && (
        <div 
          className="fixed bottom-4 right-4 bg-[#541c15] border border-[#7f2315] text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out"
          style={{
            animation: 'fadeInOut 3s ease-in-out'
          }}
        >
          Task deleted
        </div>
      )}
        <Quadrant
          title="Urgent and Important"
          tasks={tasks.do}
          description="Do: Tasks with deadlines or consequences"
          onAddTask={(task) => addTask('do', task)}
          bgColor="bg-top-left"
          textBoxColor="#afcfc1"
          onTaskClick={handleTaskClick}
          borderRoundness="rounded-tl-lg"
          border="border border-[#2F2F2F]"
          userID={userID}
          quadrant="do"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop('do', e)}
          onDragEnter={() => setDragOverColumn('do')}
          onDragLeave={() => setDragOverColumn(null)}
          dragOverColumn={dragOverColumn}
        />

        <Quadrant
          title="Not Urgent but Important"
          tasks={tasks.schedule}
          description="Schedule: Tasks with unclear deadlines that contribute to long-term success"
          onAddTask={(task) => addTask('schedule', task)}
          bgColor="bg-top-right"
          textBoxColor="#f2a18d"
          borderRoundness="rounded-tr-lg"
          onTaskClick={handleTaskClick}
          border="border-t border-r border-b border-[#2F2F2F]"
          userID={userID}
          quadrant="schedule"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop('schedule', e)}
          onDragEnter={() => setDragOverColumn('schedule')}
          onDragLeave={() => setDragOverColumn(null)}
          dragOverColumn={dragOverColumn}
        />
        <Quadrant
          title="Urgent but Not Important"
          tasks={tasks.delegate}
          description="Delegate: Tasks that must get done but don't require your specific skill set"
          onAddTask={(task) => addTask('delegate', task)}
          bgColor="bg-bottom-left"
          textBoxColor="#98b1e7"
          borderRoundness="rounded-bl-lg"
          onTaskClick={handleTaskClick}
          border="border-b border-l border-r border-[#2F2F2F]"
          userID={userID}
          quadrant="delegate"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop('delegate', e)}
          onDragEnter={() => setDragOverColumn('delegate')}
          onDragLeave={() => setDragOverColumn(null)}
          dragOverColumn={dragOverColumn}
        />
        <Quadrant
          title="Not Urgent and Not Important"
          tasks={tasks.eliminate}
          description="Delete: Distractions and unnecessary tasks"
          onAddTask={(task) => addTask('eliminate', task)}
          bgColor="bg-bottom-right"
          textBoxColor="#f5898d"
          onTaskClick={handleTaskClick}
          borderRoundness="border-b border-r border-[#2F2F2F] rounded-br-lg"
          userID={userID}
          quadrant="eliminate"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop('eliminate', e)}
          onDragEnter={() => setDragOverColumn('eliminate')}
          onDragLeave={() => setDragOverColumn(null)}
          dragOverColumn={dragOverColumn}
        />
      </div>
    </div>
  );
}