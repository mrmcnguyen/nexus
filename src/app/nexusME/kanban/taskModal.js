'use client';
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteKanbanTaskByID } from "../../../lib/db/queries";
import debounce from 'lodash/debounce'; // Debounce functions recommended for performance

export default function KanbanTaskModal({
  isVisible,
  closeModal,
  task,
  onDescriptionUpdate,
  onTitleUpdate,
  onDeleteTask,
  onMoveTask,
  epics = [],
  onAssignEpicToTask,
  onRemoveEpicFromTask,
  onPriorityUpdate
}) {

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEpicDropdownOpen, setIsEpicDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const descriptionRef = useRef(null);
  const titleRef = useRef(null);
  const epicDropdownRef = useRef(null);
  const priorityDropdownRef = useRef(null);

  console.log(task);

  // Determine task details
  const title = task.title || task.tasks?.title || 'Untitled Task';
  const taskID = task.task_id || task.tasks?.task_id || 'Unknown Task ID';
  const description = task.description || task.tasks?.description || 'No description available';
  const createdAt = task.created_at || task.tasks?.created_at || 'Unknown';
  const updatedAt = task.updated_at || task.tasks?.updated_at || 'Unknown';
  const currentEpic = task.tasks.taskEpics?.[0]?.epics;
  const currentPriority = task.priority || task.tasks?.priority || 'No Priority';

  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  // Epic color generation
  const epicColors = [
    'bg-purple-600 text-purple-100',
    'bg-blue-600 text-blue-100',
    'bg-green-600 text-green-100',
    'bg-yellow-600 text-yellow-100',
    'bg-red-600 text-red-100',
    'bg-indigo-600 text-indigo-100',
    'bg-pink-600 text-pink-100',
    'bg-teal-600 text-teal-100',
    'bg-orange-600 text-orange-100',
    'bg-cyan-600 text-cyan-100',
    'bg-emerald-600 text-emerald-100',
    'bg-violet-600 text-violet-100'
  ];

  const getEpicColor = (epicId) => {
    if (!epicId) return epicColors[0];
    // Generate a consistent color based on epic ID
    const hash = epicId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return epicColors[Math.abs(hash) % epicColors.length];
  };

  const getEpicBackgroundColor = (epicId) => {
    const color = getEpicColor(epicId);
    const colorName = color.split('-')[1]; // Extract color name (e.g., 'purple' from 'bg-purple-600')
    return `bg-${colorName}-600/20`;
  };

  const getEpicTextColor = (epicId) => {
    const color = getEpicColor(epicId);
    const colorName = color.split('-')[1];
    return `text-${colorName}-300`;
  };

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

  // Priority options
  const priorityOptions = [
    { value: 'Critical', label: 'Critical', color: 'text-red-500', bgColor: 'bg-red-500' },
    { value: 'High', label: 'High', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { value: 'Medium', label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    { value: 'Low', label: 'Low', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { value: 'No Priority', label: 'No Priority', color: 'text-gray-400', bgColor: 'bg-gray-400' }
  ];

  const getCurrentPriorityOption = () => {
    return priorityOptions.find(option => option.value === currentPriority) || priorityOptions[4];
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

  // Click outside logic for epic dropdown
  useEffect(() => {
    const handleEpicDropdownClickOutside = (event) => {
      if (
        epicDropdownRef.current &&
        !epicDropdownRef.current.contains(event.target) &&
        isEpicDropdownOpen
      ) {
        setIsEpicDropdownOpen(false);
      }
    };

    if (isEpicDropdownOpen) {
      document.addEventListener('mousedown', handleEpicDropdownClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleEpicDropdownClickOutside);
    };
  }, [isEpicDropdownOpen]);

  // Click outside logic for priority dropdown
  useEffect(() => {
    const handlePriorityDropdownClickOutside = (event) => {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target) &&
        isPriorityDropdownOpen
      ) {
        setIsPriorityDropdownOpen(false);
      }
    };

    if (isPriorityDropdownOpen) {
      document.addEventListener('mousedown', handlePriorityDropdownClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handlePriorityDropdownClickOutside);
    };
  }, [isPriorityDropdownOpen]);

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

  const handleAssignEpic = (epicId) => {
    if (onAssignEpicToTask) {
      onAssignEpicToTask(taskID, epicId);
    }
    setIsEpicDropdownOpen(false);
  };

  const handleRemoveEpic = () => {
    if (currentEpic && onRemoveEpicFromTask) {
      onRemoveEpicFromTask(taskID, currentEpic.epic_id);
    }
  };

  const handlePriorityUpdate = (priority) => {
    if (onPriorityUpdate) {
      onPriorityUpdate(taskID, priority);
    }
    setIsPriorityDropdownOpen(false);
  };

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
            {!isEditingTitle ? (
              <h2
                className="text-xl font-medium text-gray-100 flex-grow cursor-pointer hover:text-gray-200 transition-colors"
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
                className="w-full bg-transparent text-gray-100 focus:outline-none border-b border-gray-600 focus:border-blue-500 text-xl font-medium"
                placeholder="Enter task title..."
              />
            )}
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
                {/* Status Badge */}
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color} bg-opacity-20`}>
                    {currentStatus.label}
                  </span>
                </div>

                {/* Epic Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-300">Epic</h3>
                    <div className="relative" ref={epicDropdownRef}>
                      <button
                        onClick={() => setIsEpicDropdownOpen(!isEpicDropdownOpen)}
                        className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors px-3 py-1 rounded-md hover:bg-[#333]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>{currentEpic ? 'Change' : 'Assign'}</span>
                      </button>

                      {isEpicDropdownOpen && (
                        <div className="absolute right-0 top-8 bg-[#2a2a2a] border border-[#444] rounded-lg shadow-xl z-10 min-w-56">
                          {currentEpic && (
                            <button
                              onClick={handleRemoveEpic}
                              className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#333] transition-colors text-sm border-b border-[#444]"
                            >
                              Remove from Epic
                            </button>
                          )}
                          {epics.map((epic) => (
                            <button
                              key={epic.epic_id}
                              onClick={() => handleAssignEpic(epic.epic_id)}
                              className="w-full text-left px-4 py-3 hover:bg-[#333] transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${getEpicColor(epic.epic_id).split(' ')[0]}`}></div>
                                <div className="flex-1">
                                  <div className="text-gray-200 font-medium">{epic.name}</div>
                                  {epic.description && (
                                    <div className="text-gray-400 text-xs mt-1">{epic.description}</div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                          {epics.length === 0 && (
                            <div className="px-4 py-3 text-gray-500 text-sm">
                              No epics available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {currentEpic ? (
                    <div className={`${getEpicBackgroundColor(currentEpic.epic_id)} rounded-lg p-4 border border-opacity-30`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getEpicColor(currentEpic.epic_id).split(' ')[0]}`}></div>
                        <div>
                          <div className={`${getEpicTextColor(currentEpic.epic_id)} font-medium`}>
                            {currentEpic.name}
                          </div>
                          {currentEpic.description && (
                            <div className={`${getEpicTextColor(currentEpic.epic_id)} text-sm mt-1 opacity-80`}>
                              {currentEpic.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm bg-[#2a2a2a] rounded-lg p-4 border border-[#444]">
                      No epic assigned
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Description</h3>
                  <div
                    ref={descriptionRef}
                    onClick={() => setIsEditingDescription(true)}
                    className="min-h-[100px] cursor-text"
                  >
                    {!isEditingDescription ? (
                      <div className="text-gray-400 text-sm bg-[#2a2a2a] rounded-lg p-4 border border-[#444] min-h-[100px]">
                        {editedDescription || 'Click to add a description...'}
                      </div>
                    ) : (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 text-gray-300 text-sm resize-none min-h-[100px] focus:outline-none focus:border-blue-500"
                        placeholder="Enter task description..."
                        onBlur={handleDescriptionSave}
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
              {/* Priority */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Priority</h3>
                <div className="relative" ref={priorityDropdownRef}>
                  <button
                    onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getCurrentPriorityOption().bgColor}`}></div>
                      <span className="text-gray-200">{getCurrentPriorityOption().label}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isPriorityDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-[#444] rounded-lg shadow-xl z-10">
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePriorityUpdate(option.value)}
                          className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-[#333] transition-colors text-left"
                        >
                          <div className={`w-3 h-3 rounded-full ${option.bgColor}`}></div>
                          <span className="text-gray-200">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Move Task */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Move to Status</h3>
                <div className="space-y-2">
                  {Object.entries(statusOptions)
                    .filter(([key]) => key !== task.status)
                    .map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onMoveTask(key, task);
                          closeModal();
                        }}
                        className={`w-full flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${value.color} bg-opacity-20 hover:bg-opacity-30`}
                      >
                        <span>{value.icon}</span>
                        <span className="text-gray-200">{value.label}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Delete */}
              <div className="pt-4 border-t space-y-2 border-[#333]">
                <button
                  className="w-full flex items-center justify-center space-x-1 p-2 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-colors"
                  onClick={handleDeleteTask}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Task</span>
                </button>
                <button
                  className="w-full flex items-center justify-center space-x-1 p-2 bg-gray-600/20 border border-gray-600/30 rounded-lg text-gray-400 hover:bg-gray-600/30 transition-colors"
                  onClick={closeModal}
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}