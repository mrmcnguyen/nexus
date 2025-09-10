"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addKanbanTask, editTaskDescription, editTaskName, getKanbanTasks, updateKanbanTaskState, updateTaskPriority } from "../../../lib/db/queries";
import { getEpicsWithTaskCounts, assignTaskToEpic, removeTaskFromEpic, getTaskEpic } from "../../../lib/db/epicQueries";
import { createClient } from "../../../../supabase/client";
import Loading from "./loading";
import TaskModal from "./taskModal";
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from "framer-motion";

export default function KanbanComponent() {
  const [editingColumn, setEditingColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [tasks, setTasks] = useState({
    todo: [],
    inprogress: [],
    done: [],
  });
  const [userID, setUserID] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deletionNotification, setDeletionNotification] = useState(null);
  const [epics, setEpics] = useState([]);
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const [selectedTaskForEpic, setSelectedTaskForEpic] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [selectedEpicFilter, setSelectedEpicFilter] = useState(null);
  const [showEpicDropdown, setShowEpicDropdown] = useState(false);

  const router = useRouter();

  const headerColors = {
    'Backlog': 'text-gray-200',
    'To Do': 'text-gray-200',
    'In Progress': 'text-gray-200',
    'Done': 'text-gray-200'
  }

  const borderColors = {
    'Backlog': 'border-neutral-800',
    'To Do': 'border-neutral-800',
    'In Progress': 'border-neutral-800',
    'Done': 'border-neutral-800'
  }

  const hoverBorderColors = {
    'Backlog': 'hover:border-gray-300',
    'To Do': 'hover:border-gray-300',
    'In Progress': 'hover:border-gray-300',
    'Done': 'hover:border-gray-300'
  }

  const columnColors = {
    'Backlog': 'bg-neutral-950',
    'To Do': 'bg-neutral-950',
    'In Progress': 'bg-neutral-950',
    'Done': 'bg-neutral-950'
  }

  // Modern priority badge styles
  const priorityColors = {
    urgent: 'bg-red-50 border border-red-200 text-red-600',
    high: 'bg-orange-50 border border-orange-200 text-orange-600',
    medium: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
    low: 'bg-blue-50 border border-blue-200 text-blue-600',
    'No Priority': 'bg-black border border-neutral-800 text-gray-500'
  };

  const priorityLabels = {
    urgent: 'text-red-600',
    high: 'text-orange-600',
    medium: 'text-yellow-700',
    low: 'text-blue-600',
    'No Priority': 'text-gray-300'
  };

  // Priority icons mapping
  const priorityIcons = {
    Critical: '/urgent.svg',
    high: '/high.svg',
    medium: '/middle.svg',
    low: '/low.svg',
    'no priority': '/no-priority.svg',
    'No Priority': '/no-priority.svg'
  };

// Priority badge configuration
const priorityConfig = {
  low: {
    label: 'Low',
    icon: '●',
    bgColor: 'bg-green-500/15',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/15'
  },
  medium: {
    label: 'Medium',
    icon: '▲',
    bgColor: 'bg-amber-500/15',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/15'
  },
  high: {
    label: 'High',
    icon: '◆',
    bgColor: 'bg-red-500/15',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/15'
  },
  critical: {
    label: 'Critical',
    icon: '⚠',
    bgColor: 'bg-purple-500/15',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/15'
  },
  urgent: {
    label: 'Urgent',
    icon: '⚠',
    bgColor: 'bg-purple-500/15',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/15'
  },
  'no priority': {
    label: 'None',
    icon: '○',
    bgColor: 'bg-gray-500/15',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500/15'
  }
};
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

  const supabase = createClient();
  const dropdownRef = useRef(null);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (user) {
        setUserID(user.user.id);
      } else {
        console.error("Error while fetching user ID: ", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch all Kanban tasks and allocate them
  useEffect(() => {
    const fetchKanbanTasks = async () => {
      if (userID) {
        const result = await getKanbanTasks(userID);
        if (result) {
          const categorizedTasks = {
            backlog: [], // Initialize Backlog column
            todo: [],
            inprogress: [],
            done: [],
          };

          result.forEach((task) => {
            if (task.status === "Backlog") categorizedTasks.backlog.push(task);
            else if (task.status === "To Do") categorizedTasks.todo.push(task);
            else if (task.status === "In Progress") categorizedTasks.inprogress.push(task);
            else if (task.status === "Done") categorizedTasks.done.push(task);
          });

          setTasks(categorizedTasks);
        }
        setIsLoading(false);
      }
    };

    fetchKanbanTasks();
  }, [userID]);

  // Fetch epics
  useEffect(() => {
    const fetchEpics = async () => {
      if (userID) {
        const result = await getEpicsWithTaskCounts(userID);
        if (result) {
          setEpics(result);
        }
      }
    };

    fetchEpics();
  }, [userID]);

  // Helper to get tasks by status, filtered by epic if needed
  const getTasksByStatus = (status) => {
    let col = [];
    if (status === "Backlog") col = tasks.backlog;
    else if (status === "To Do") col = tasks.todo;
    else if (status === "In Progress") col = tasks.inprogress;
    else if (status === "Done") col = tasks.done;
    else return [];
    if (!selectedEpicFilter) return col;
    return col.filter(task => {
      // Epic can be on task.epic or task.tasks.taskEpics[0].epics
      const epicId = task.epic?.epic_id || task.tasks?.taskEpics?.[0]?.epics?.epic_id;
      return epicId === selectedEpicFilter;
    });
  };

  const handleAddTask = async (e, status) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const result = await addKanbanTask(userID, newTaskTitle, status, 'kanban');

      if (result.success) {
        const newTask = { status: status }
        newTask.tasks = result.data;
        setTasks((prevTasks) => ({
          ...prevTasks,
          [status.toLowerCase().replace(" ", "")]: [
            ...prevTasks[status.toLowerCase().replace(" ", "")],
            newTask,
          ],
        }));
        setNewTaskTitle(""); // Clear input
        setEditingColumn(null); // Close input
      }
    }
  };

  const handleMoveTask = async (newStatus, task) => {

    // Check if dropped over the same column
    let taskCol = task.status || task.tasks?.status;
    if (taskCol === newStatus) {
      return; // End early and don't do anything if dragger over the same column
    }

    let taskId = task.task_id || task.tasks?.task_id;

    let res = await updateKanbanTaskState(taskId, newStatus);
    if (!res) {
      console.error("Error updating Kanban task state.");
    }

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      console.log(updatedTasks);
      let movedTask;

      // Find and remove the task from its current status
      for (const status in updatedTasks) {
        const index = updatedTasks[status].findIndex((task) => task.id === taskId || task.tasks?.task_id === taskId);
        console.log(index);
        if (index > -1) {
          [movedTask] = updatedTasks[status].splice(index, 1);
          break;
        }
      }

      console.log("Moved Task: ", movedTask);

      // Add it to the new status
      if (movedTask) {
        movedTask.status = newStatus;
        updatedTasks[newStatus.toLowerCase().replace(" ", "")].push(movedTask);
      }

      return updatedTasks;
    });
  };

  const removeTask = (task) => {
    const taskId = task.task_id || task.tasks?.task_id;

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      // Find and remove the task from its current status
      for (const status in updatedTasks) {
        const index = updatedTasks[status].findIndex((t) => t.id === taskId || t.tasks?.task_id === taskId);
        if (index > -1) {
          updatedTasks[status].splice(index, 1); // Remove task
          break;
        }
      }

      return updatedTasks; // Ensure tasks are updated correctly
    });

    // No need to trigger any other state changes here if not fetching tasks again
  };

  const updateTaskDescription = async (task, description) => {
    const taskId = task.task_id || task.tasks?.task_id;

    const res = await editTaskDescription(taskId, description);
    if (res[0]) {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const status in updatedTasks) {
          const index = updatedTasks[status].findIndex((t) => t.id === taskId || t.tasks?.task_id === taskId);
          if (index > -1) {
            updatedTasks[status][index] = {
              ...updatedTasks[status][index],
              tasks: {
                ...updatedTasks[status][index].tasks,
                description: description
              }
            };
            break;
          }
        }
        return updatedTasks;
      });
    }
  };

  const updateTaskTitle = async (task, title) => {
    const taskId = task.task_id || task.tasks?.task_id;

    const res = await editTaskName(taskId, title);
    if (res[0]) {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const status in updatedTasks) {
          const index = updatedTasks[status].findIndex((t) => t.id === taskId || t.tasks?.task_id === taskId);
          if (index > -1) {
            updatedTasks[status][index] = {
              ...updatedTasks[status][index],
              tasks: {
                ...updatedTasks[status][index].tasks,
                title: title
              }
            };
            break;
          }
        }
        return updatedTasks;
      });
    }
  };

  const handleTaskPriorityUpdate = async (taskId, priority) => {
    console.log(taskId, priority);
    const res = await updateTaskPriority(taskId, priority);
    if (res.success) {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const status in updatedTasks) {
          const index = updatedTasks[status].findIndex((t) => t.id === taskId || t.tasks?.task_id === taskId);
          if (index > -1) {
            updatedTasks[status][index] = {
              ...updatedTasks[status][index],
              tasks: {
                ...updatedTasks[status][index].tasks,
                priority: priority
              }
            };
            break;
          }
        }
        return updatedTasks;
      });
    }
  };

  const handleKeyDown = (e, status) => {
    if (e.key === "Enter") {
      handleAddTask(e, status);
    } else if (e.key === "Escape") {
      setEditingColumn(null);
      setNewTaskTitle("");
    }
  };

  const handleDrop = (status, e) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData("task"));
    handleMoveTask(status, task);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleFinishTask = (task) => {
    handleMoveTask("Done", task);
    setIsModalOpen(false);
  };

  const navigateToEpics = () => {
    router.push('/nexusME/kanban/epics');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'kanban' ? 'list' : 'kanban');
  };

  const assignEpicToTask = async (taskId, epicId) => {
    const result = await assignTaskToEpic(taskId, epicId);
    console.log(result);
    if (result.success) {
      // Update the task in the state to show the epic
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const status in updatedTasks) {
          const index = updatedTasks[status].findIndex((t) => t.id === taskId || t.tasks?.task_id === taskId);
          if (index > -1) {
            const epic = epics.find(e => e.epic_id === epicId);
            updatedTasks[status][index] = {
              ...updatedTasks[status][index],
              epic: epic
            };
            break;
          }
        }
        return updatedTasks;
      });
      setIsEpicModalOpen(false);
      setSelectedTaskForEpic(null);
    }
  };

  const removeEpicFromTask = async (taskId, epicId) => {
    const result = await removeTaskFromEpic(taskId, epicId);
    if (result.success) {
      // Update the task in the state to remove the epic
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const status in updatedTasks) {
          const index = updatedTasks[status].findIndex((t) => t.id === taskId || t.tasks?.task_id === taskId);
          if (index > -1) {
            updatedTasks[status][index] = {
              ...updatedTasks[status][index],
              epic: null
            };
            break;
          }
        }
        return updatedTasks;
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Function to show deletion notification
  const showDeletionNotification = (task) => {
    toast.success(`Task "${task.tasks?.title || task.title}" deleted`, {
      duration: 3000,
      position: 'top-center',
      icon: '🗑️',
      style: {
        borderRadius: '12px',
        background: '#111827',
        color: '#fff',
      },
    });
  };

  // Helper to get all tasks for list view, filtered by epic
  const getAllTasks = () => {
    let all = [
      ...tasks.backlog.map(task => ({ ...task, status: 'Backlog' })),
      ...tasks.todo.map(task => ({ ...task, status: 'To Do' })),
      ...tasks.inprogress.map(task => ({ ...task, status: 'In Progress' })),
      ...tasks.done.map(task => ({ ...task, status: 'Done' }))
    ];
    if (!selectedEpicFilter) return all.sort((a, b) => {
      const statusOrder = { 'Backlog': 0, 'To Do': 1, 'In Progress': 2, 'Done': 3 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      const dateA = new Date(a.tasks?.created_at || a.created_at);
      const dateB = new Date(b.tasks?.created_at || b.created_at);
      return dateB - dateA;
    });
    return all.filter(task => {
      const epicId = task.epic?.epic_id || task.tasks?.taskEpics?.[0]?.epics?.epic_id;
      return epicId === selectedEpicFilter;
    }).sort((a, b) => {
      const statusOrder = { 'Backlog': 0, 'To Do': 1, 'In Progress': 2, 'Done': 3 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      const dateA = new Date(a.tasks?.created_at || a.created_at);
      const dateB = new Date(b.tasks?.created_at || b.created_at);
      return dateB - dateA;
    });
  };

  // List View Component
  const ListView = () => {
    const allTasks = getAllTasks();
    const [newTaskInput, setNewTaskInput] = useState("");
    const [isAddingTask, setIsAddingTask] = useState(false);

    const handleAddTaskToList = async (e) => {
      e.preventDefault();
      if (newTaskInput.trim()) {
        const result = await addKanbanTask(userID, newTaskInput, 'To Do', 'kanban');
        if (result.success) {
          setNewTaskInput("");
          setIsAddingTask(false);
          // Refresh tasks
          const updatedResult = await getKanbanTasks(userID);
          if (updatedResult) {
            const categorizedTasks = {
              backlog: [],
              todo: [],
              inprogress: [],
              done: [],
            };
            updatedResult.forEach((task) => {
              if (task.status === "Backlog") categorizedTasks.backlog.push(task);
              else if (task.status === "To Do") categorizedTasks.todo.push(task);
              else if (task.status === "In Progress") categorizedTasks.inprogress.push(task);
              else if (task.status === "Done") categorizedTasks.done.push(task);
            });
            setTasks(categorizedTasks);
          }
        }
      }
    };

    return (
      <div className="h-[calc(100vh-160px)] overflow-y-auto shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold tracking-tighttext-gray-200">All Tasks ({allTasks.length})</h2>
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
            >
              <Image
                src="/plus.svg"
                width={14}
                height={14}
                alt="Add Task"
              />
              <span>Add Task</span>
            </button>
          </div>
          <p className="text-gray-300 text-sm">Tasks organized by status and creation date</p>

          {/* Quick Add Task Form */}
          {isAddingTask && (
            <form onSubmit={handleAddTaskToList} className="mt-4 p-4 bg-black border border-neutral-800 rounded-xl">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Enter task title..."
                  className="flex-1 bg-neutral-900 border border-gray-300 rounded-xl px-3 py-2 text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/30"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl transition-colors duration-200 shadow-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskInput("");
                  }}
                  className="bg-neutral-900 border border-gray-300 hover:bg-black text-gray-100 px-4 py-2 rounded-xl transition-colors duration-200 shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-2">
          {allTasks.map((task) => {
            const taskId = task.tasks?.task_id || task.task_id;
            const title = task.tasks?.title || task.title;
            const description = task.tasks?.description || task.description;
            const priority = task.tasks?.priority || task.priority || 'No Priority';
            const createdAt = task.tasks?.created_at || task.created_at;

            return (
              <motion.div
                key={taskId}
                layout
                className={`bg-black rounded-md px-4 py-3 hover:bg-neutral-900 transition-colors duration-200 border border-neutral-800 cursor-pointer shadow-sm hover:shadow-md`}
                onClick={() => handleTaskClick(task)}
                whileHover={{ y: -1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-100 font-medium text-sm leading-6">{title}</h3>

                    {description && (
                      <p className="text-gray-300 text-sm line-clamp-2 mt-1">
                        {description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFinishTask(task);
                      }}
                      className="text-gray-200 hover:text-gray-100 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                      title="Mark as Done"
                    >
                      <Image
                        src="/done.svg"
                        width={16}
                        height={16}
                        alt="Done"
                      />
                    </button>
                  </div>
                </div>
                {/* Lightweight metadata row */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const priorityRaw = task.tasks?.priority || task.priority || 'No Priority';
                      const normalizedPriority = typeof priorityRaw === 'string' ? priorityRaw.toLowerCase() : priorityRaw;
                      const labelClass = priorityLabels[normalizedPriority] || 'text-gray-300';
                      return (
                        <span className={`text-[11px] ${labelClass}`}>{String(priorityRaw)}</span>
                      );
                    })()}
                  </div>
                  <span className="text-[11px] text-slate-400"></span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {allTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-300 text-lg mb-2">No tasks found</div>
            <p className="text-slate-400 text-sm">Create your first task to get started</p>
          </div>
        )}
      </div>
    );
  };

  if (isLoading || !tasks) {
    return <Loading />;
  }

  return (
    <div className="p-6 min-h-screen flex flex-col bg-black">
      <div className="sticky top-0 z-10 -mx-6 px-6 pb-4 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/70">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <h1 className="text-2xl text-white font-semibold tracking-tight">Personal Kanban</h1>
            <span className="flex flex-row items-center ml-3 border border-neutral-800 bg-neutral-900 text-gray-200 tracking-tight text-xs rounded-xl px-3 py-1 shadow-sm">
              <Image
                src="/synced.svg"
                width={14}
                className="mr-1"
                height={14}
                alt="synced"
                priority
              />
              Synced
            </span>
          </div>
          <div className="flex flex-row gap-2">
            {/* Epic Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={`flex flex-row items-center bg-black border border-neutral-800 px-3 py-2 text-gray-100 tracking-tight text-sm rounded-md hover:bg-neutral-900 transition-colors duration-200 shadow-sm ${selectedEpicFilter ? 'ring-1 ring-slate-900/10' : ''}`}
                onClick={() => setShowEpicDropdown((v) => !v)}
                type="button"
              >
                <Image
                  src={"/filter.svg"}
                  className="mr-2 filter invert"
                  width={14}
                  alt={"filter"}
                  height={14}
                  priority
                />
                {selectedEpicFilter ? (epics.find(e => e.epic_id === selectedEpicFilter)?.title || 'Epic') : 'Filter by Epic'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              <AnimatePresence>
                {showEpicDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="absolute right-0 z-20 mt-2 w-64 bg-neutral-800 border py-2 border-neutral-800 rounded-md shadow-lg"
                  >
                    <button
                      className="w-full text-left text-sm px-4 py-2 text-gray-100 hover:bg-neutral-900"
                      onClick={() => { setSelectedEpicFilter(null); setShowEpicDropdown(false); }}
                    >
                      All Epics
                    </button>
                    {epics.map(epic => (
                      <button
                        key={epic.epic_id}
                        className={`w-full text-left px-4 py-2 hover:bg-neutral-900 flex items-center space-x-2 ${selectedEpicFilter === epic.epic_id ? 'bg-black' : ''}`}
                        onClick={() => { setSelectedEpicFilter(epic.epic_id); setShowEpicDropdown(false); }}
                      >
                        <span className={`${getEpicColor(epic.epic_id)} px-2 py-1 rounded-full text-xs`}>{epic.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* End Epic Filter Dropdown */}
            <button
              onClick={toggleViewMode}
              className="flex flex-row bg-black border border-neutral-800 items-center px-3 py-2 text-gray-100 tracking-tight text-sm transition-colors duration-200 rounded-md hover:bg-neutral-900 shadow-sm"
            >
              <Image
                src={viewMode === 'kanban' ? "/list.svg" : "/kanban.svg"}
                className="mr-2 filter invert"
                width={14}
                alt={viewMode === 'kanban' ? "list" : "kanban"}
                height={14}
                priority
              />
              {viewMode === 'kanban' ? 'View as List' : 'View as Kanban'}
            </button>
            <button
              onClick={navigateToEpics}
              className="flex flex-row bg-black border border-neutral-800 items-center px-3 py-2 text-gray-100 tracking-tight text-sm transition-colors duration-200 rounded-md hover:bg-neutral-900 shadow-sm"
            >
              <Image
                src="/epic.svg"
                className="mr-2 filter invert"
                width={14}
                alt="epic"
                height={14}
                priority
              />
              Manage Epics
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TaskModal
              isVisible={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
              task={selectedTask}
              onDeleteTask={(task) => {
                removeTask(task);
                showDeletionNotification(task);
                setIsModalOpen(false);
              }}
              onDescriptionUpdate={(task, description) => updateTaskDescription(task, description)}
              onTitleUpdate={(task, title) => updateTaskTitle(task, title)}
              onFinishTask={(task) => handleFinishTask(task)}
              onMoveTask={(task, key) => handleMoveTask(task, key)}
              epics={epics}
              onAssignEpicToTask={(taskID, epic_id) => assignEpicToTask(taskID, epic_id)}
              onRemoveEpicFromTask={removeEpicFromTask}
              onPriorityUpdate={(taskId, priority) => handleTaskPriorityUpdate(taskId, priority)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Epic Assignment Modal */}
      <AnimatePresence>
      {isEpicModalOpen && (
        <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="bg-neutral-900 border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Assign Epic
            </h2>

            <p className="text-gray-200 mb-4">
              Assign "{selectedTaskForEpic?.tasks?.title || selectedTaskForEpic?.title}" to an epic:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {epics.map((epic) => (
                <button
                  key={epic.epic_id}
                  onClick={() => assignEpicToTask(epic.epic_id)}
                  className="w-full text-left p-3 bg-black border border-neutral-800 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`${getEpicColor(epic.epic_id)} px-2 py-1 rounded-full text-xs`}>
                      {epic.name}
                    </span>
                    <span className="text-slate-800 font-medium">{epic.name}</span>
                  </div>
                  {epic.description && (
                    <div className="text-gray-200 text-sm mt-1">{epic.description}</div>
                  )}
                  <div className="text-gray-300 text-xs mt-1">{epic.task_count} tasks</div>
                </button>
              ))}
            </div>

            {epics.length === 0 && (
              <p className="text-gray-300 text-center py-4">
                No epics available. Create one first!
              </p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsEpicModalOpen(false);
                  setSelectedTaskForEpic(null);
                }}
                className="px-4 py-2 text-gray-200 hover:text-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="flex flex-1 gap-4 overflow-x-auto">
        <motion.div className="flex flex-row gap-4 w-full">
          {['Backlog', 'To Do', 'In Progress', 'Done'].map((status) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${columnColors[status]} rounded-md p-4 flex flex-col min-h-[600px] flex-1 min-w-[300px] border border-neutral-800 shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex flex-row items-center mb-4">
                <Image
                  src={`/${status.toLowerCase().replace(' ', '')}.svg`}
                  className="mr-3"
                  width={16}
                  height={16}
                  alt={status}
                  priority
                />
                <div className="flex flex-row w-full justify-between items-center">
                  <h2 className={`text-base ${headerColors[status]} tracking-tight font-semibold`}>
                    {status}
                  </h2>
                  <div className={`text-xs text-gray-200 border border-neutral-800 bg-black px-2 py-1 rounded-full font-medium`}>
                    {getTasksByStatus(status).length}
                  </div>
                </div>
              </div>
      
              {/* Task List */}
              <div
                className={`flex-1 space-y-3 transition-colors overflow-y-auto ${dragOverColumn === status ? 'bg-black rounded-xl' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  handleDrop(status, e);
                  setDragOverColumn(null); // Reset the drag-over state
                }}
                onDragEnter={() => setDragOverColumn(status)}
                onDragLeave={() => setDragOverColumn(null)}
              >
                {getTasksByStatus(status).map((task) => (
                  <motion.div
                    key={task.tasks?.task_id || task.task_id || 'UNKNOWN'}
                    className={`p-4 bg-neutral-900 rounded-md shadow-sm border ${borderColors[status]} transition-all duration-150 ease-in-out cursor-pointer hover:border-neutral-600`}
                    draggable="true"
                    onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-100 text-sm tracking-tight font-medium leading-relaxed">
                        {task.tasks?.title || task.title || 'UNKNOWN'}
                      </p>
      
                      {/* Epic Badge and Priority */}
                      <div className="flex flex-row items-center justify-between">
                        {task.tasks.taskEpics?.[0]?.epics?.title && (
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center space-x-1 px-2 py-1 border border-neutral-800 rounded-full">
                              <div className={`w-2 h-2 rounded-full ${getEpicColor(task.tasks.taskEpics[0].epics.epic_id)}`}></div>
                              <span className="text-[10px] tracking-tight font-normal text-gray-200">
                                {task.tasks.taskEpics[0].epics.title}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                        {(() => {
                          const priorityRaw = task.tasks?.priority || task.priority || 'No Priority';
                          const normalizedPriority = typeof priorityRaw === 'string' ? priorityRaw.toLowerCase() : priorityRaw;
                          const config = priorityConfig[normalizedPriority] || priorityConfig['no priority'];

                          return (
                            <div className={`
                              inline-flex items-center gap-1 px-2 py-1 rounded-md
                              ${config.bgColor} ${config.textColor} ${config.borderColor}
                              text-xs font-semibold uppercase tracking-tight
                            `}>
                              <span className="text-xs">{config.icon}</span>
                              <span className="text-[10px] tracking-tight">{config.label}</span>
                            </div>
                          );
                        })()}
                      </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
      
                {/* Add Task Section */}
                {editingColumn === status ? (
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, status)}
                    onBlur={() => setEditingColumn(null)}
                    autoFocus
                    className="p-3 bg-neutral-900 border border-gray-300 text-gray-100 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/30 shadow-sm"
                    placeholder="Add new task..."
                  />
                ) : (
                  <button
                    className="flex w-full text-sm rounded-xl items-center text-gray-300 p-3 hover:bg-black transition-colors duration-200 ease-in-out border-2 border-dashed border-neutral-800 hover:border-gray-300"
                    onClick={() => {
                      setEditingColumn(status);
                      setNewTaskTitle(''); // Reset input when opening
                    }}
                  >
                    <Image
                      src="/plus.svg"
                      className="mr-2"
                      width={14}
                      height={14}
                      alt="Add Task"
                      priority
                    />
                    Add Task
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ListView />
      )}

      {deletionNotification && (
        <div
          className="fixed bottom-4 right-4 bg-slate-900 border border-black/10 text-white px-4 py-2 rounded-xl shadow-lg z-50 transition-all duration-300 ease-in-out"
          style={{
            animation: 'fadeInOut 3s ease-in-out'
          }}
        >
          Task deleted
        </div>
      )}
    </div>
  );
}