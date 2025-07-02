import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteEisenhowerTaskByID } from "../../../lib/db/queries";

export default function TaskModal({ isVisible, closeModal, task, onUpdateTask, onDeleteTask, onFinishTask }) {

  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const descriptionRef = useRef(null);

  // Click outside logic for description editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (descriptionRef.current && !descriptionRef.current.contains(event.target) && isEditing) {
        handleDescriptionSave();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  // Early return if not visible or if task is null
  if (!isVisible || !task) return null;

  console.log(task);

  // Determine task details
  const title = task.tasks?.title || task.title || 'Untitled Task';
  const taskID = task.tasks?.task_id || task.task_id || 'Unknown Task ID';
  const description = task.tasks?.description || task.description || 'No description available';
  const createdAt = task.tasks?.created_at || task.created_at || 'Unknown';
  const updatedAt = task.tasks?.updated_at || task.updated_at || 'Unknown';

  const matrixTypeDescriptions = {
    do: {
      label: 'Urgent and Important',
      explanation: 'This means you should be putting most of your time and effort into this task because it is both time-sensitive and critical for your objectives.',
      color: 'bg-red-600/20 border-red-600/30 text-red-400',
      icon: '⚡'
    },
    schedule: {
      label: 'Not Urgent but Important',
      explanation: 'This means the task is important to your goals but not time-sensitive. You should plan to work on it later or at a more suitable time.',
      color: 'bg-blue-600/20 border-blue-600/30 text-blue-400',
      icon: '📅'
    },
    delegate: {
      label: 'Urgent but Not Important',
      explanation: 'This means the task needs to be done soon but does not necessarily require your direct involvement. Consider delegating it to someone else.',
      color: 'bg-yellow-600/20 border-yellow-600/30 text-yellow-400',
      icon: '👥'
    },
    eliminate: {
      label: 'Not Urgent and Not Important',
      explanation: 'This means the task does not contribute to your goals and is not time-sensitive. You should consider eliminating it to focus on more meaningful activities.',
      color: 'bg-gray-600/20 border-gray-600/30 text-gray-400',
      icon: '❌'
    },
  };

  const matrixType = matrixTypeDescriptions[task.matrix_type] || {
    label: 'Unknown Matrix Type',
    explanation: 'No additional information is available for this type.',
    color: 'bg-gray-600/20 border-gray-600/30 text-gray-400',
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
    let res = deleteEisenhowerTaskByID(taskID);
    if (res) {
      onDeleteTask(task.matrix_type, task);
      closeModal();
    } else {
      console.error("Deleting Task Failed. See console error from query.js.");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#333]">
            <h2 className="text-xl font-medium text-gray-100 flex-grow">{title}</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-[#333]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Matrix Type Badge */}
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${matrixType.color}`}>
                    <span className="mr-2">{matrixType.icon}</span>
                    {matrixType.label}
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-300">Description</h3>
                    {!isEditing ? (
                      <button
                        onClick={handleDescriptionEdit}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1 rounded-md hover:bg-[#333]"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={handleDescriptionSave}
                        className="text-xs text-green-400 hover:text-green-300 transition-colors px-3 py-1 rounded-md hover:bg-[#333]"
                      >
                        Save
                      </button>
                    )}
                  </div>

                  <div
                    ref={descriptionRef}
                    className="min-h-[100px] cursor-text"
                  >
                    {!isEditing ? (
                      <div
                        className="text-gray-400 text-sm bg-[#2a2a2a] rounded-lg p-4 border border-[#444] min-h-[100px]"
                        onClick={handleDescriptionEdit}
                      >
                        {description || 'Click to add a description...'}
                      </div>
                    ) : (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 text-gray-300 text-sm resize-none min-h-[100px] focus:outline-none focus:border-blue-500"
                        placeholder="Enter task description..."
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#333]">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Created</p>
                    <p className="text-sm text-gray-400">{new Date(createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Updated</p>
                    <p className="text-sm text-gray-400">{new Date(updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l border-[#333] p-6 space-y-6">
              {/* Matrix Type Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Matrix Classification</h3>
                <div className={`${matrixType.color} rounded-lg p-4 border`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{matrixType.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{matrixType.label}</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-80 leading-relaxed">
                    {matrixType.explanation}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Actions</h3>

                <button
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400 hover:bg-green-600/30 transition-colors"
                  onClick={() => {
                    onFinishTask(task);
                    closeModal();
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Finish Task</span>
                </button>

                <button
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send to Kanban</span>
                </button>
              </div>

              {/* Delete */}
              <div className="pt-4 border-t border-[#333]">
                <button
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-colors"
                  onClick={handleDeleteTask}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Task</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}