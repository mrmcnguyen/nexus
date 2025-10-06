'use client';
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserLabelsAction, getTaskLabelsAction } from "../../label-actions";
import { deleteKanbanTaskByIDAction } from "../../kanban-actions";
import debounce from 'lodash/debounce'; // Debounce functions recommended for performance
import { useRouter } from "next/navigation";
import LabelPicker from "../../../../components/LabelPicker";
import { Calendar } from "../../../../components/Calendar";

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
  onPriorityUpdate,
  onDueDateUpdate,
  userId
}) {

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEpicDropdownOpen, setIsEpicDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [taskLabels, setTaskLabels] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const descriptionRef = useRef(null);
  const titleRef = useRef(null);
  const epicDropdownRef = useRef(null);
  const priorityDropdownRef = useRef(null);
  const calendarRef = useRef(null);
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
  const dueDate = task.tasks?.due_date || null;

  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  // Modern epic color generation (Dark Mode Optimized)
  const epicColors = [
    'bg-purple-900 text-purple-200 border border-purple-800',
    'bg-blue-900 text-blue-200 border border-blue-800',
    'bg-green-900 text-green-200 border border-green-800',
    'bg-yellow-900 text-yellow-200 border border-yellow-800',
    'bg-red-900 text-red-200 border border-red-800',
    'bg-indigo-900 text-indigo-200 border border-indigo-800',
    'bg-pink-900 text-pink-200 border border-pink-800',
    'bg-teal-900 text-teal-200 border border-teal-800',
    'bg-orange-900 text-orange-200 border border-orange-800',
    'bg-cyan-900 text-cyan-200 border border-cyan-800',
    'bg-emerald-900 text-emerald-200 border border-emerald-800',
    'bg-violet-900 text-violet-200 border border-violet-800',
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
 
  // Modern status colors and labels
    const statusOptions = {
      Backlog: {
        label: 'Backlog',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-neutral-400">
          <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
        </svg>
        )
      },
      'To Do': {
        label: 'To Do',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-neutral-400">
            <path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" />
          </svg>
        )
      },
      'In Progress': {
        label: 'In Progress',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-neutral-400">
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
        </svg>
        )
      },
      Done: {
        label: 'Done',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-neutral-400">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
          </svg>
        )
      }
    }

  const currentStatus = statusOptions[task.status] || {
    label: 'Unknown Status',
    color: 'bg-slate-800 text-slate-300 border border-neutral-800',
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

  const priorityIcons = {
    urgent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-500">
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
    ),
    high: (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500">
          <title>prio-high</title>
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="icon" fill="currentColor" transform="translate(64.000000, 85.333333)">
                  <path d="M-4.26325641e-14,1.42108547e-14 L85.3333333,1.42108547e-14 L85.3333333,341.333333 L-4.26325641e-14,341.333333 L-4.26325641e-14,1.42108547e-14 Z M149.333333,1.42108547e-14 L234.666667,1.42108547e-14 L234.666667,341.333333 L149.333333,341.333333 L149.333333,1.42108547e-14 Z M298.666667,1.42108547e-14 L384,1.42108547e-14 L384,341.333333 L298.666667,341.333333 L298.666667,1.42108547e-14 Z" id="Combined-Shape">
                    </path>
              </g>
          </g>
      </svg>
    ),
    medium: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 512 512" 
        className="text-neutral-500"
      >
        <title>prio-middle</title>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="icon" fill="currentColor" transform="translate(128.000000, 85.333333)">
            <path d="M0,1.42108547e-14 L85.3333333,1.42108547e-14 L85.3333333,341.333333 L0,341.333333 L0,1.42108547e-14 Z M170.666667,1.42108547e-14 L256,1.42108547e-14 L256,341.333333 L170.666667,341.333333 L170.666667,1.42108547e-14 Z" id="Combined-Shape" />
          </g>
        </g>
      </svg>
    ),
    low: (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500">
          <title>prio-low</title>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="icon" fill="currentColor" transform="translate(213.333333, 85.333333)">
                  <rect id="Rectangle" x="2.84217094e-14" y="1.42108547e-14" width="85.3333333" height="341.333333">
                  </rect>
              </g>
          </g>
      </svg>
    ),
    'No Priority': (
      <svg viewBox="0 0 48 48" enableBackground="new 0 0 48 48" id="Layer_3" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="text-neutral-500">
        <path d="M44,0H4C1.791,0,0,1.791,0,4v40c0,2.209,1.791,4,4,4h40c2.209,0,4-1.791,4-4V4C48,1.791,46.209,0,44,0z   M43,26.5H5v-5h38V26.5z" fill="currentColor"/>
      </svg>
    )
  };  

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

// Fetch available labels when modal opens
useEffect(() => {
  const fetchLabels = async () => {
    if (isVisible && userId) {
      // Fetch only the user's available labels
      const labels = await getUserLabelsAction(userId);
      setAvailableLabels(labels || []);

      // Use the passed-in labels for this task
      if (task?.tasks?.task_labels) {
        setTaskLabels(task.tasks.task_labels);
      }
    }
  };

  fetchLabels();
}, [isVisible, userId, task]);

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

  // Click outside logic for calendar dropdown
  useEffect(() => {
    const handleCalendarClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        showCalendar
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleCalendarClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleCalendarClickOutside);
    };
  }, [showCalendar]);

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
    let res = deleteKanbanTaskByIDAction(taskID);
    if (res) {
      onDeleteTask(task);
      closeModal();
    } else {
      console.error("Deleting Task Failed. See console error from query.js.");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    handleDeleteTask();
    setShowDeleteConfirmation(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
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

  const handleDueDateUpdate = async (newDueDate) => {
    if (onDueDateUpdate) {
      await onDueDateUpdate(taskID, newDueDate);
    }
    setShowCalendar(false);
  };

  const handleCalendarDateSelect = (selectedDate) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleDueDateUpdate(formattedDate);
    }
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
          className="bg-neutral-950 border border-neutral-800 rounded-md w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-800">
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
              className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-md hover:bg-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action Bar */}
          <div className="p-2">
            <div className="flex items-center justify-between gap-4">
              {/* Status Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
                {currentStatus.label}
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Epic Button */}
                <div className="relative" ref={epicDropdownRef}>
                  <button
                    onClick={() => setIsEpicDropdownOpen(!isEpicDropdownOpen)}
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md transition-colors text-xs text-neutral-400 hover:bg-neutral-800"
                  >
                    <div className={`w-3 h-3 rounded-full ${getEpicColor(currentEpic?.epic_id)}`}></div>
                    <span>{currentEpic ? currentEpic.title : 'Epic'}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isEpicDropdownOpen && (
                    <div className="absolute right-0 top-10 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10 min-w-56 p-1">
                      {currentEpic && (
                        <button
                          onClick={handleRemoveEpic}
                          className="w-full text-left px-2 py-1 text-red-400 hover:bg-red-900/30 rounded-md transition-colors text-sm border-b border-neutral-800"
                        >
                          Remove from Epic
                        </button>
                      )}
                      {epics.map((epic) => (
                        <button
                          key={epic.epic_id}
                          onClick={() => handleAssignEpic(epic.epic_id)}
                          className="w-full text-left px-2 py-1 hover:bg-neutral-900 rounded-md transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getEpicColor(epic.epic_id)}`}></div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{epic.name}</div>
                              {epic.description && (
                                <div className="text-neutral-400 text-xs mt-1">{epic.description}</div>
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

                {/* Priority Button */}
                <div className="relative" ref={priorityDropdownRef}>
                  <button
                    onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                    className="flex items-center space-x-2 px-2.5 py-1.5 text-xs rounded-md hover:bg-neutral-800 transition-colors text-neutral-400"
                  >
                    <span className="w-4 h-4">{priorityIcons[getCurrentPriorityOption().value]}</span>
                    <span>{getCurrentPriorityOption().label}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isPriorityDropdownOpen && (
                    <div className="absolute right-0 top-10 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10 min-w-48 p-1">
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePriorityUpdate(option.value)}
                          className="w-full flex items-center space-x-2 px-1 py-1 hover:bg-neutral-900 rounded-md transition-colors text-left"
                        >
                          <span className="w-4 h-4">{priorityIcons[option.value]}</span>
                          <span className="text-neutral-400 text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Move to Status Buttons */}
                {Object.entries(statusOptions)
                  .filter(([key]) => key !== task.status)
                  .map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onMoveTask(key, task);
                        closeModal();
                      }}
                      className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs text-neutral-400 transition-colors hover:bg-neutral-800`}
                    >
                      <span>{value.icon}</span>
                      <span className="font-medium">{value.label}</span>
                    </button>
                  ))}

                 {/* Due Date Button */}
                 <div className="relative" ref={calendarRef}>
                   <button
                     className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md hover:bg-neutral-800 transition-colors text-sm"
                     onClick={() => setShowCalendar(!showCalendar)}
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-4 ${task.tasks?.due_date_color || 'text-neutral-400'}`}>
                       <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75ZM5.25 6a1.5 1.5 0 0 0-1.5 1.5v11.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V7.5a1.5 1.5 0 0 0-1.5-1.5H5.25Z" clipRule="evenodd" />
                     </svg>
                     <span className={`text-xs ${task.tasks?.due_date_color || 'text-neutral-400'}`}>
                       {task.tasks?.relative_due_date || 'Due Date'}
                     </span>
                   </button>

                   {/* Calendar Dropdown */}
                    {showCalendar && (
                      <div className="absolute right-0 top-10 z-20 rounded-md border bg-popover p-3 shadow-md">
                        <Calendar
                          onSelect={handleDueDateUpdate}
                          className="rounded-md border-none w-[280px]" // key change here
                          captionLayout="dropdown"
                          mode="single"
                          selected={dueDate ? new Date(dueDate) : undefined}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleDueDateUpdate('')}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove due date
                          </button>
                        </div>
                      </div>
                    )}
                 </div>

                {/* Start Pomodoro Button */}
                <button
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md hover:bg-neutral-800 transition-colors text-sm"
                  onClick={() => {
                    const taskId = task.task_id || task.tasks?.task_id || '';
                    const titleParam = encodeURIComponent(editedTitle || title || '');
                    const descParam = encodeURIComponent(editedDescription || description || '');
                    router.push(`/nexusME/pomodoro?taskId=${taskId}&title=${titleParam}&description=${descParam}`);
                    closeModal();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-neutral-500">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                  </svg>

                </button>

                {/* Delete Button */}
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors text-sm text-red-400"
                  onClick={handleDeleteClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-neutral-500">
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 pt-0 overflow-y-auto">
            <div className="space-y-6">
              {/* Labels Section */}
              <div className="space-y-3">
                <LabelPicker
                  taskId={taskID}
                  selectedLabels={taskLabels}
                  availableLabels={availableLabels}
                  onLabelsChange={setTaskLabels}
                  userId={userId}
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-300">Description</h3>
                <div
                  ref={descriptionRef}
                  onClick={() => setIsEditingDescription(true)}
                  className="min-h-[200px] cursor-text"
                >
                  {!isEditingDescription ? (
                    <div className="text-slate-300 text-sm bg-neutral-900 rounded-md p-4 min-h-[200px]">
                      {editedDescription || 'Click to add a description...'}
                    </div>
                  ) : (
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full bg-neutral-900 rounded-md p-4 text-slate-300 text-sm resize-none min-h-[200px] focus:outline-none"
                      placeholder="Enter task description..."
                      onBlur={handleDescriptionSave}
                    />
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
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
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
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
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-400">
                      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Delete Task</h3>
                    <p className="text-sm text-slate-400">This action cannot be undone.</p>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-6">
                  Are you sure you want to delete "<span className="font-medium text-white">{editedTitle}</span>"? This will permanently remove the task and all its data.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    Delete Task
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}