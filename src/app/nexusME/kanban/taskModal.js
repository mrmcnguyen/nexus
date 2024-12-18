'use client';
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteKanbanTaskByID } from "../../../lib/db/queries";
import debounce from 'lodash/debounce'; // Recommended for performance

export default function KanbanTaskModal({ isVisible, closeModal, task, onDescriptionUpdate, onTitleUpdate, onDeleteTask, onMoveTask }) {
  
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const descriptionRef = useRef(null);
  const titleRef = useRef(null);

   // Determine task details
   const title = task.title || task.tasks?.title || 'Untitled Task';
   const taskID = task.task_id || task.tasks?.task_id || 'Unknown Task ID';
   const description = task.description || task.tasks?.description || 'No description available';
   const createdAt = task.created_at || task.tasks?.created_at || 'Unknown';
   const updatedAt = task.updated_at || task.tasks?.updated_at || 'Unknown';

   const [editedTitle, setEditedTitle] = useState('');
   const [editedDescription, setEditedDescription] = useState('');

    // Kanban-specific status colors and labels
  const statusOptions = {
    Backlog: {
      label: 'Backlog',
      color: 'bg-gray-600',
      icon: '📋'
    },
    'To Do': {
      label: 'To Do',
      color: 'bg-blue-600',
      icon: '📝'
    },
    'In Progress': {
      label: 'In Progress',
      color: 'bg-yellow-600',
      icon: '🚧'
    },
    'Done': {
      label: 'Done',
      color: 'bg-green-600',
      icon: '✅'
    }
  }

   const currentStatus = statusOptions[task.status] || {
    label: 'Unknown Status',
    color: 'bg-gray-900',
    icon: '❓'
  };

  // Debounced save function for description
  const debouncedDescriptionSave = useCallback(
    debounce((task, description) => {
      if (onDescriptionUpdate) {
        onDescriptionUpdate(task, description);
      }
    }, 500), // 500ms delay before saving
    [onDescriptionUpdate]
  );

  useEffect(() => {
    if (isVisible) {
      // Instead of always resetting to the original values,
      // only reset if no edits have been made or if a new task is loaded
      if (title !== editedTitle || task !== editedTitle) {
        setEditedDescription(description);
        setEditedTitle(title);
      }
      setIsEditing(true);
      setIsEditingTitle(false);
    }
  }, [isVisible, task, title, description]);

   // Debounced save function for title
   const debouncedTitleSave = useCallback(
    debounce((task, title) => {
      if (onTitleUpdate) {
        onTitleUpdate(task, title);
      }
    }, 500), // 500ms delay before saving
    [onTitleUpdate]
  );

  // Autosave effect for description
  useEffect(() => {
    // Only trigger autosave if description has actually changed
    if (isEditingDescription && editedDescription !== description) {
      debouncedDescriptionSave(task, editedDescription);
    }
  }, [editedDescription, isEditingDescription, description, task, debouncedDescriptionSave]);

   // Autosave effect for title
   useEffect(() => {
    // Only trigger autosave if title has actually changed
    if (isEditingTitle && editedTitle !== title) {
      debouncedTitleSave(task, editedTitle);
    }
  }, [editedTitle, isEditingTitle, title, task, debouncedTitleSave]);

  // Existing click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        descriptionRef.current && 
        !descriptionRef.current.contains(event.target) && 
        isEditingDescription
      ) {
        setIsEditingDescription(false);
      }
    };

    if (isEditingDescription) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingDescription]);

  // Click outside logic for title
  useEffect(() => {
    const handleTitleClickOutside = (event) => {
      if (
        titleRef.current && 
        !titleRef.current.contains(event.target) && 
        isEditingTitle
      ) {
        setIsEditingTitle(false);
      }
    };

    if (isEditingTitle) {
      document.addEventListener('mousedown', handleTitleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleTitleClickOutside);
    };
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    // Immediate save if needed
    if (onTitleUpdate) {
      onTitleUpdate(task, editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    // Immediate save if needed
    if (onDescriptionUpdate) {
      onDescriptionUpdate(task, editedDescription);
    }
    setIsEditingDescription(false);
  };

  const handleDeleteTask = () => {
    let res = deleteKanbanTaskByID(taskID);
    if (res) {
      onDeleteTask(task);
      closeModal();
    } else {
      console.error("Deleting Task Failed. See console error from query.js.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="bg-[#1f1f1f] text-gray-300 rounded-lg w-3/4 lg:w-1/2 p-6 shadow-lg flex flex-col"
        >
           <div className="flex justify-between items-center mb-4">
            {!isEditingTitle ? (
              <h2 
                className="lg:text-xl 2xl:text-2xl font-light flex-grow"
                onClick={() => setIsEditingTitle(true)}
              >
                {editedTitle}
              </h2>
            ) : (
              <input
                ref={titleRef}
                type="text"
                value={editedTitle}
                onChange={(e) => {
                  setEditedTitle(e.target.value);
                  setIsEditingTitle(true);
                }}
                onBlur={handleTitleSave}
                className="w-full bg-[#1f1f1f] text-gray-300 focus:outline-none focus:border-[#6db6fe] focus:ring-none border-b-2  lg:text-xl 2xl:text-2xl font-light"
              />
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="flex flex-row space-x-4 flex-grow">
            <div className="lg:w-3/4 2xl:w-5/6 flex flex-col space-y-4">
              <div className={`flex items-center ${currentStatus.color} p-2 rounded-lg`}>
                <span className="text-2xl mr-2">{currentStatus.icon}</span>
                <p className="lg:text-base 2xl:text-xl font-semibold text-gray-200">
                  {currentStatus.label}
                </p>
              </div>
              
              <div 
                ref={descriptionRef}
                onClick={() => setIsEditingDescription(true)}
                className="flex flex-col flex-grow cursor-text"
              >
                <p className="text-sm text-gray-400 font-semibold mb-2">Description:</p>
                
                {!isEditingDescription ? (
                  <p className="text-sm text-gray-400 flex-grow overflow-auto">
                    {editedDescription || 'Click to add a description'}
                  </p>
                ) : (
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full bg-[#1f1f1f] focus:outline-none focus:ring-none text-gray-400 rounded-lg text-sm flex-grow resize-none"
                    rows={4}
                    onBlur={handleDescriptionSave}
                  />
                )}
              </div>
              
              <div className="mt-auto">
                <div className="mb-4">
                  <p className="lg:text-xs 2xl:text-sm text-gray-400">
                    <span className="font-semibold">Created At: </span>
                    {new Date(createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="lg:text-xs 2xl:text-sm text-gray-400">
                    <span className="font-semibold">Updated At: </span>
                    {new Date(updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/4 2xl:w-1/6 space-y-4">
              <div className="bg-gray-900/50 border-[#6cb4fb] border rounded-lg p-4 mb-2 text-center">
                <div className="text-3xl mb-2">🔄</div>
                <p className="lg:text-xs 2xl:text-sm text-gray-200">
                  Move Task to:
                </p>
                {Object.entries(statusOptions)
                  .filter(([key]) => key !== task.status)
                  .map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onMoveTask(key, task);
                        closeModal();
                      }}
                      className={`w-full mt-2 p-1 rounded-lg ${value.color} text-xs hover:opacity-80 transition-all`}
                    >
                      {value.icon} {value.label}
                    </button>
                ))}
              </div>
              
              <button 
                className="lg:text-xs 2xl:text-sm w-full rounded-lg bg-[#541c15] border border-[#7f2315] flex justify-center items-center p-2 hover:bg-[#e54d2e80] hover:border-[#e54d2e] transition-all duration-200"
                onClick={handleDeleteTask}
              >
                <Image
                  src="/delete.svg"
                  className="mx-2"  
                  width={14}
                  alt="Delete Task"
                  height={14}
                  priority
                />
                Delete Task
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}