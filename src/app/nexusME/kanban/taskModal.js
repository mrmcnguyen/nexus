'use client';
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteKanbanTaskByID } from "../../../lib/db/queries";
import debounce from 'lodash/debounce'; // Debounce functions recommended for performance
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  // Modern epic color generation
  const epicColors = [
    'bg-purple-100 text-purple-700 border border-purple-200',
    'bg-blue-100 text-blue-700 border border-blue-200',
    'bg-green-100 text-green-700 border border-green-200',
    'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'bg-red-100 text-red-700 border border-red-200',
    'bg-indigo-100 text-indigo-700 border border-indigo-200',
    'bg-pink-100 text-pink-700 border border-pink-200',
    'bg-teal-100 text-teal-700 border border-teal-200',
    'bg-orange-100 text-orange-700 border border-orange-200',
    'bg-cyan-100 text-cyan-700 border border-cyan-200',
    'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'bg-violet-100 text-violet-700 border border-violet-200'
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
    const colorName = color.split('-')[1]; // Extract color name (e.g., 'purple' from 'bg-purple-100')
    return `bg-${colorName}-50`;
  };

  const getEpicTextColor = (epicId) => {
    const color = getEpicColor(epicId);
    const colorName = color.split('-')[1];
    return `text-${colorName}-700`;
  };

  // Modern status colors and labels
  const statusOptions = {
    Backlog: {
      label: 'Backlog',
      color: 'bg-slate-800 text-slate-300 border border-slate-700',
      icon: '📋'
    },
    'To Do': {
      label: 'To Do',
      color: 'bg-amber-900/30 text-amber-300 border border-amber-700',
      icon: '📝'
    },
    'In Progress': {
      label: 'In Progress',
      color: 'bg-blue-900/30 text-blue-300 border border-blue-700',
      icon: '🚧'
    },
    'Done': {
      label: 'Done',
      color: 'bg-emerald-900/30 text-emerald-300 border border-emerald-700',
      icon: '✅'
    }
  }

  const currentStatus = statusOptions[task.status] || {
    label: 'Unknown Status',
    color: 'bg-slate-800 text-slate-300 border border-slate-700',
    icon: '❓'
  };

  // Modern priority options
  const priorityOptions = [
    { value: 'urgent', label: 'Urgent', color: 'text-red-700', bgColor: 'bg-red-100 border border-red-200', icon: '/urgent.svg' },
    { value: 'high', label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100 border border-orange-200', icon: '/high.svg' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100 border border-yellow-200', icon: '/middle.svg' },
    { value: 'low', label: 'Low', color: 'text-blue-700', bgColor: 'bg-blue-100 border border-blue-200', icon: '/low.svg' },
    { value: 'No Priority', label: 'No Priority', color: 'text-slate-600', bgColor: 'bg-slate-100 border border-slate-200', icon: '/no-priority.svg' }
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
          className="bg-gray-800 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-700">
            {!isEditingTitle ? (
              <h2
                className="text-xl font-semibold text-white flex-grow cursor-pointer hover:text-slate-300 transition-colors"
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
                className="w-full bg-transparent text-white focus:outline-none border-b border-slate-600 focus:border-blue-500 text-xl font-semibold"
                placeholder="Enter task title..."
              />
            )}
            <button
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-slate-700"
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
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                </div>

                {/* Epic Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-300">Epic</h3>
                    <div className="relative" ref={epicDropdownRef}>
                      <button
                        onClick={() => setIsEpicDropdownOpen(!isEpicDropdownOpen)}
                        className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors px-3 py-1 rounded-lg hover:bg-blue-900/30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>{currentEpic ? 'Change' : 'Assign'}</span>
                      </button>

                      {isEpicDropdownOpen && (
                        <div className="absolute right-0 top-8 bg-gray-800 border border-slate-700 rounded-xl shadow-lg z-10 min-w-56">
                          {currentEpic && (
                            <button
                              onClick={handleRemoveEpic}
                              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 transition-colors text-sm border-b border-slate-700"
                            >
                              Remove from Epic
                            </button>
                          )}
                          {epics.map((epic) => (
                            <button
                              key={epic.epic_id}
                              onClick={() => handleAssignEpic(epic.epic_id)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${getEpicColor(epic.epic_id).split(' ')[0]}`}></div>
                                <div className="flex-1">
                                  <div className="text-white font-medium">{epic.name}</div>
                                  {epic.description && (
                                    <div className="text-slate-400 text-xs mt-1">{epic.description}</div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                          {epics.length === 0 && (
                            <div className="px-4 py-3 text-slate-400 text-sm">
                              No epics available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {currentEpic ? (
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getEpicColor(currentEpic.epic_id).split(' ')[0]}`}></div>
                        <div>
                          <div className="text-white font-medium">
                            {currentEpic.name}
                          </div>
                          {currentEpic.description && (
                            <div className="text-slate-300 text-sm mt-1 opacity-80">
                              {currentEpic.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-sm bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      No epic assigned
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-300">Description</h3>
                  <div
                    ref={descriptionRef}
                    onClick={() => setIsEditingDescription(true)}
                    className="min-h-[100px] cursor-text"
                  >
                    {!isEditingDescription ? (
                      <div className="text-slate-300 text-sm bg-slate-700/50 rounded-xl p-4 border border-slate-600 min-h-[100px]">
                        {editedDescription || 'Click to add a description...'}
                      </div>
                    ) : (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-slate-300 text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter task description..."
                        onBlur={handleDescriptionSave}
                      />
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Created</p>
                    <p className="text-sm text-slate-300">{new Date(createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Updated</p>
                    <p className="text-sm text-slate-300">{new Date(updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l border-slate-700 p-6 space-y-6">
              {/* Priority */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-300">Priority</h3>
                <div className="relative" ref={priorityDropdownRef}>
                  <button
                    onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getCurrentPriorityOption().icon ? (
                        <Image
                          src={getCurrentPriorityOption().icon}
                          alt={getCurrentPriorityOption().label}
                          width={16}
                          height={16}
                          className="filter invert"
                        />
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${getCurrentPriorityOption().bgColor.split(' ')[0]}`}></div>
                      )}
                      <span className="text-white">{getCurrentPriorityOption().label}</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isPriorityDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-slate-700 rounded-xl shadow-lg z-10">
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePriorityUpdate(option.value)}
                          className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-700 transition-colors text-left"
                          style={{
                            animation: 'epicDropdownFadeIn 0.18s cubic-bezier(0.4,0,0.2,1)'
                          }}
                        >
                          {option.icon ? (
                            <Image
                              src={option.icon}
                              alt={option.label}
                              width={16}
                              height={16}
                              className="filter invert"
                            />
                          ) : (
                            <div className={`w-3 h-3 rounded-full ${option.bgColor.split(' ')[0]}`}></div>
                          )}
                          <span className="text-white">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Move Task */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-300">Move to Status</h3>
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
                        className={`w-full flex items-center space-x-2 p-3 rounded-xl text-sm transition-colors ${value.color} hover:opacity-80`}
                      >
                        <span>{value.icon}</span>
                        <span className="font-medium">{value.label}</span>
                      </button>
                    ))}
                </div>
              </div>


              {/* Delete */}
              {/* Start Pomodoro */}
              <div className="pt-4 border-t space-y-2 border-slate-700">
                <button
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-900/30 border border-blue-700 rounded-xl text-blue-300 hover:bg-blue-800/50 transition-colors"
                  onClick={() => {
                    const taskId = task.task_id || task.tasks?.task_id || '';
                    const titleParam = encodeURIComponent(editedTitle || title || '');
                    const descParam = encodeURIComponent(editedDescription || description || '');
                    router.push(`/nexusME/pomodoro?taskId=${taskId}&title=${titleParam}&description=${descParam}`);
                    closeModal();
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m5-3a8 8 0 11-16 0 8 8 0 0116 0z" />
                  </svg>
                  <span>Start Pomodoro</span>
                </button>
                <button
                  className="w-full flex items-center justify-center space-x-1 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-300 hover:bg-red-800/50 transition-colors"
                  onClick={handleDeleteTask}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Task</span>
                </button>
                <button
                  className="w-full flex items-center justify-center space-x-1 p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-600 transition-colors"
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