import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteEisenhowerTaskByID } from "../../../lib/db/queries";

export default function TaskModal({ isVisible, closeModal, task, onUpdateTask, onDeleteTask }) {
  console.log(task)
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  if (!isVisible) return null;

  // Determine task details
  const title = task.tasks?.title || task.title || 'Untitled Task';
  const taskID = task.tasks?.task_id || task.task_id || 'Unknown Task ID';
  const description = task.tasks?.description || task.description || 'No description available';
  const createdAt = task.tasks?.created_at || task.created_at || 'Unknown';
  const updatedAt = task.tasks?.updated_at || task.updated_at || 'Unknown';

  const matrixTypeDescriptions = {
    do: {
      label: 'Urgent and Important',
      explanation:
        'This means you should be putting most of your time and effort into this task because it is both time-sensitive and critical for your objectives.',
      icon: '🔥'
    },
    schedule: {
      label: 'Not Urgent but Important',
      explanation:
        'This means the task is important to your goals but not time-sensitive. You should plan to work on it later or at a more suitable time.',
      icon: '📅'
    },
    delegate: {
      label: 'Urgent but Not Important',
      explanation:
        'This means the task needs to be done soon but does not necessarily require your direct involvement. Consider delegating it to someone else.',
      icon: '👥'
    },
    eliminate: {
      label: 'Not Urgent and Not Important',
      explanation:
        'This means the task does not contribute to your goals and is not time-sensitive. You should consider eliminating it to focus on more meaningful activities.',
      icon: '❌'
    },
  };

  const matrixType = matrixTypeDescriptions[task.matrix_type] || {
    label: 'Unknown Matrix Type',
    explanation: 'No additional information is available for this type.',
    color: 'bg-gray-900/50 border-gray-700',
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

  const handleDeleteTask = (quadrant, task) => {
    let res = deleteEisenhowerTaskByID(taskID);
    if (res){
      onDeleteTask(quadrant, task);
      closeModal();
    } else{
      console.error("Deleting Task Failed. See console error from query.js.");
    }
  }

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
                <p className="lg:text-base 2xl:text-xl font-semibold text-gray-200">
                  {matrixType.label}
                </p>
              
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
              <div
                className={`relative bg-gray-900/50 border-gray-700 border rounded-lg p-4 mb-2 text-center`}
              >
                <div className="text-3xl mb-2">{matrixType.icon}</div>
                <p className="lg:text-xs 2xl:text-sm text-gray-200">
                  You classified this task as "{matrixType.label}"
                </p>
                <div className="mt-2 text-xs text-gray-300">
                  {matrixType.explanation}
                </div>
              </div>
              
              <button className="lg:text-xs 2xl:text-sm w-full rounded-lg bg-[#006239] border border-[#128353] flex justify-center items-center p-2 hover:bg-[#3ecf8e80] hover:border-[#3ecf8e] transition-all duration-200">
                <Image
                  src="/finish.svg"
                  className="mx-2"  
                  width={14}
                  alt="Mark Done"
                  height={14}
                  priority
                />
                Finish Task
              </button>
              <button className="lg:text-xs text-white 2xl:text-sm w-full rounded-lg bg-[#6f99da] border border-[#a8caff] flex justify-center items-center p-2 hover:bg-[#84a6d9] hover:border-[#ccced1] transition-all duration-200">
                <Image
                  src="/send.svg"
                  className="mx-2"  
                  width={14}
                  alt="Mark Done"
                  height={14}
                  priority
                />
                Send to Kanban 
              </button>
              <button className="lg:text-xs 2xl:text-sm w-full rounded-lg bg-[#541c15] border border-[#7f2315] flex justify-center items-center p-2 hover:bg-[#e54d2e80] hover:border-[#e54d2e] transition-all duration-200"
                onClick={() => handleDeleteTask(task.matrix_type, task)}
              >
                <Image
                  src="/delete.svg"
                  className="mx-2"  
                  width={14}
                  alt="Mark Done"
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