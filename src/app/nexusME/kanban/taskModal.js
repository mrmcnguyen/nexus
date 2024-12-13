import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteKanbanTaskByID } from "../../../lib/db/queries";

export default function KanbanTaskModal({ isVisible, closeModal, task, onUpdateTask, onDeleteTask, onMoveTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  console.log(task);

  if (!isVisible) return null;

  // Determine task details
  const title = task.title || task.tasks?.title || 'Untitled Task';
  const taskID = task.task_id || task.tasks?.task_id || 'Unknown Task ID';
  const description = task.description || task.tasks?.description || 'No description available';
  const createdAt = task.created_at || task.tasks?.created_at || 'Unknown';
  const updatedAt = task.updated_at || task.tasks?.updated_at || 'Unknown';

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
  };

  const currentStatus = statusOptions[task.status] || {
    label: 'Unknown Status',
    color: 'bg-gray-900',
    icon: '❓'
  };

  const handleDescriptionEdit = () => {
    setIsEditing(true);
    setEditedDescription(description);
  };

  const handleDescriptionSave = () => {
    if (onUpdateTask) {
      onUpdateTask({
        ...task,
        description: editedDescription
      });
    }
    setIsEditing(false);
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
            <h2 className="lg:text-xl 2xl:text-2xl font-light">{title}</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              ✕
            </button>
          </div>
          
          <div className="flex flex-row space-x-4 flex-grow">
            <div className="lg:w-3/4 2xl:w-5/6 flex flex-col space-y-4">
              <div className={`flex items-center ${currentStatus.color} p-2 rounded-lg`}>
                <span className="text-2xl mr-2">{currentStatus.icon}</span>
                <p className="lg:text-base 2xl:text-xl font-semibold text-gray-200">
                  {currentStatus.label}
                </p>
              </div>
              
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 font-semibold">Description:</p>
                  {!isEditing ? (
                    <button 
                      onClick={handleDescriptionEdit}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                  ) : (
                    <button 
                      onClick={handleDescriptionSave}
                      className="text-xs text-green-400 hover:text-green-300"
                    >
                      Save
                    </button>
                  )}
                </div>
                
                {!isEditing ? (
                  <p className="text-sm text-gray-400 flex-grow overflow-auto">{description}</p>
                ) : (
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full bg-[#292929] text-gray-300 rounded-lg p-2 mt-2 text-sm flex-grow resize-none"
                    rows={4}
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