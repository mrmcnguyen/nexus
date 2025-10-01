'use client';

import React, { useEffect, useState } from 'react';
import Quadrant from './Quadrant';
import { createClient } from '../../../../supabase/client';
import { addUnallocatedEisenhowerTaskAction, getEisenhowerTasksAction, getEisenhowerTaskByIDAction, allocateEisenhowerTaskAction, finishEisenhowerTaskAction } from '../../eisenhower-actions';
import { getUserLabelsAction, getTaskLabelsAction } from '../../label-actions';
import HelpModal from './helpModal';
import Image from 'next/image';
import TaskModal from './taskModal'
import Loading from './loading';
import { toast } from 'react-hot-toast';
import LabelFilter from '../../../../components/LabelFilter';

// Main Eisenhower Matrix Page Component
// This component displays the Eisenhower Matrix with tasks divided into quadrants
// It allows users to drag and drop tasks, add new tasks, and view task details in a modal

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
  const [availableLabels, setAvailableLabels] = useState([]);
  const [selectedLabelFilters, setSelectedLabelFilters] = useState([]);

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
        const result = await getEisenhowerTasksAction(userID);
        setAllTasks(result || {}); // Safeguard against null
        setIsLoading(false); // Stop loading when data is fetched
      }
    };

    fetchAllEisenhowerTasks();
  }, [userID]);

  // Fetch available labels
  useEffect(() => {
    const fetchLabels = async () => {
      if (userID) {
        const labels = await getUserLabelsAction(userID);
        setAvailableLabels(labels || []);
      }
    };

    fetchLabels();
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

  // Filter tasks by selected labels
  const filterTasksByLabels = (taskList) => {
    if (selectedLabelFilters.length === 0) return taskList;
    
    return taskList.filter(task => {
      // For now, we'll assume tasks have labels in the future
      // This will be updated when we modify the task structure
      return true; // Placeholder - will be implemented when labels are added to tasks
    });
  };

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
    // Remove from quadrant view
    setTasks(prevTasks => ({
      ...prevTasks,
      [quadrant]: prevTasks[quadrant].filter(t => {
        const taskId = t.tasks?.task_id || t.task_id;
        const removeTaskId = taskToRemove.tasks?.task_id || taskToRemove.task_id;
        return taskId !== removeTaskId;
      })
    }));

    // ALSO remove from allTasks
    setAllTasks(prevAllTasks =>
      prevAllTasks.filter(t => {
        const taskId = t.tasks?.task_id || t.task_id;
        const removeTaskId = taskToRemove.tasks?.task_id || taskToRemove.task_id;
        return taskId !== removeTaskId;
      })
    );
  };

  const handleDrop = async (quadrant, e) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData('task'));

    const res = await allocateEisenhowerTaskAction(task.task_id || task.tasks?.task_id, quadrant);
    if (!res) {
      console.error('Error allocating task. Please check logs.');
    }

    let newTask = await getEisenhowerTaskByIDAction(task.task_id || task.tasks?.task_id, userID);

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
    await finishEisenhowerTaskAction(task.task_id || task.tasks?.task_id);

    const finishedTask = await getEisenhowerTaskByIDAction(task.task_id || task.tasks?.task_id, userID);

    // Determine the current quadrant of the task
    const currentQuadrant = Object.keys(tasks).find(quadrant =>
      tasks[quadrant].some(t => (t.task_id || t.tasks?.task_id) === (task.task_id || task.tasks?.task_id))
    );

    // Update the task in its quadrant
    if (currentQuadrant) {
      setTasks(prevTasks => ({
        ...prevTasks,
        [currentQuadrant]: prevTasks[currentQuadrant].map(t =>
          (t.task_id || t.tasks?.task_id) === (finishedTask.task_id || finishedTask.tasks?.task_id)
            ? finishedTask
            : t
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

    toast.success(`Task "${task.tasks?.title || task.title}" completed`, {
      duration: 3000,
      position: 'top-center',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      try {
        const res = await addUnallocatedEisenhowerTaskAction(userID, 'eisenhower', newTask);

        if (res.success) {
          // Fetch the newly added task
          const taskID = res.data.task_id;
          const updatedTask = await getEisenhowerTaskByIDAction(taskID, userID);

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
    toast.success(`Task "${task.tasks?.title || task.title}" deleted`, {
      duration: 3000,
      position: 'top-center',
      icon: '🗑️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  // Show loading spinner or placeholder while fetching tasks
  if (isLoading || !allTasks) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex p-4 bg-black space-x-8 relative">
      {/* Deletion Notification */}

      <style jsx global>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
      `}</style>

      <div className="w-1/4 bg-neutral-950 border border-[#333] shadow-2xl rounded-xl p-6 h-full flex flex-col">
        <div className='flex flex-row justify-between items-center mb-4'>
          <h2 className="text-lg font-medium tracking-tight text-gray-100">Backlog</h2>
          <button className='flex flex-row items-center text-gray-400 hover:text-gray-200 transition-colors px-3 py-1 rounded-lg hover:bg-[#333]' onClick={() => setHelpClick(true)}>
            Help
            <Image
              src="/help.svg"
              className="mx-2"
              width={16}
              alt="Help"
              height={16}
              priority
            />
          </button>
          <HelpModal isVisible={helpClick} closeModal={() => setHelpClick(false)} />
        </div>
        
        {/* Label Filter */}
        <div className="mb-4">
          <LabelFilter
            availableLabels={availableLabels}
            selectedLabels={selectedLabelFilters}
            onSelectionChange={setSelectedLabelFilters}
            className="w-full"
          />
        </div>
        <input
          className='bg-neutral-800 border border-[#444] w-full text-sm text-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:border-blue-500 placeholder:text-gray-500 transition-colors'
          placeholder='Enter everything you need done...'
          onKeyDown={handleKeyPress}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto space-y-2">
          {unallocatedTasks.map((task, index) => (
            <div
              key={index}
              className="bg-[#232323] border border-[#444] text-gray-300 p-3 rounded-lg shadow hover:bg-[#292929] transition-colors cursor-grab"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))}
              onClick={() => handleTaskClick(task)}
            >
              {task.tasks?.title || task.title || 'Untitled Task'}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-3/4 h-full">
        <TaskModal
          isVisible={isModalVisible}
          closeModal={() => setModalVisible(false)}
          task={selectedTask}
          userId={userID}
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