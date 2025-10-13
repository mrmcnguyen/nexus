"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getEpicsWithTaskCountsAction, assignTaskToEpicAction, removeTaskFromEpicAction, getTaskEpicAction } from "../../epic-actions";
import { getUserLabelsAction, getTaskLabelsAction } from "../../label-actions";
import { fetchKanbanTasks, addKanbanTaskAction, updateKanbanTaskStateAction, deleteKanbanTaskByIDAction, updateTaskPriorityAction } from "../../kanban-actions";
import { editTaskNameAction, editTaskDescriptionAction, editTaskDueDateAction } from "../../task-actions";
import { createClient } from "../../../../supabase/client";
import Loading from "./loading";
import TaskModal from "./taskModal";
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from "framer-motion";
import LabelFilter from "../../../../components/LabelFilter";
import LabelBadge from "../../../../components/LabelBadge";

export default function KanbanComponent( { initialTasks } ) {
  const [editingColumn, setEditingColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [tasks, setTasks] = useState(initialTasks || {
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
  const [selectedEpicFilter, setSelectedEpicFilter] = useState(null);
  const [showEpicDropdown, setShowEpicDropdown] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [selectedLabelFilters, setSelectedLabelFilters] = useState([]);

  const router = useRouter();

  const headerColors = {
    'Backlog': 'text-gray-700 dark:text-gray-200',
    'To Do': 'text-gray-700 dark:text-gray-200',
    'In Progress': 'text-gray-700 dark:text-gray-200',
    'Done': 'text-gray-700 dark:text-gray-200'
  }

  const borderColors = {
    'Backlog': 'border-gray-300 dark:border-neutral-800',
    'To Do': 'border-gray-300 dark:border-neutral-800',
    'In Progress': 'border-gray-300 dark:border-neutral-800',
    'Done': 'border-gray-300 dark:border-neutral-800'
  }

  const columnColors = {
    'Backlog': 'bg-gray-50 dark:bg-neutral-950',
    'To Do': 'bg-gray-50 dark:bg-neutral-950',
    'In Progress': 'bg-gray-50 dark:bg-neutral-950',
    'Done': 'bg-gray-50 dark:bg-neutral-950'
  }

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
    const fetchAllKanbanTasks = async () => {
      if (userID) {
        const result = await fetchKanbanTasks(userID);
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

    fetchAllKanbanTasks();
  }, [userID]);

  // Fetch epics
  useEffect(() => {
    const fetchEpics = async () => {
      if (userID) {
        const result = await getEpicsWithTaskCountsAction(userID);
        if (result) {
          setEpics(result);
        }
      }
    };

    fetchEpics();
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
      const result = await addKanbanTaskAction(userID, newTaskTitle, status, 'kanban');

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

    let res = await updateKanbanTaskStateAction(taskId, newStatus);
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

    const res = await editTaskDescriptionAction(taskId, description);
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

    const res = await editTaskNameAction(taskId, title);
    console.log(res);
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

  const updateTaskDueDate = async (taskId, dueDate) => {
    const res = await editTaskDueDateAction(taskId, dueDate);
    if (res.success) {
      // Refetch all tasks to get updated relative due date calculations
      const result = await fetchKanbanTasks(userID);
      if (result) {
        const categorizedTasks = {
          backlog: [],
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
    }
  };

  const handleTaskPriorityUpdate = async (taskId, priority) => {
    console.log(taskId, priority);
    const res = await updateTaskPriorityAction(taskId, priority);
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

  const assignEpicToTask = async (taskId, epicId) => {
    const result = await assignTaskToEpicAction(taskId, epicId);
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
    const result = await removeTaskFromEpicAction(taskId, epicId);
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

  if (isLoading || !tasks) {
    return <Loading />;
  }

  return (
    <div className="p-6 min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300">
      <div className="sticky top-0 z-10 -mx-6 px-6 pb-4 bg-white/80 dark:bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/70 transition-colors duration-300">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <h1 className="text-2xl text-gray-900 dark:text-white font-semibold tracking-tight transition-colors duration-300">Personal Kanban</h1>
            <span className="flex flex-row items-center ml-3 border border-gray-300 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-200 tracking-tight text-xs rounded-xl px-3 py-1 shadow-sm transition-colors duration-300">
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
            {/* Label Filter */}
            <LabelFilter
              availableLabels={availableLabels}
              selectedLabels={selectedLabelFilters}
              onSelectionChange={setSelectedLabelFilters}
            />
            
            {/* Epic Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={`flex flex-row items-center bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 px-3 py-2 text-gray-700 dark:text-gray-100 tracking-tight text-sm rounded-md hover:bg-gray-200 dark:hover:bg-neutral-900 transition-colors duration-200 shadow-sm ${selectedEpicFilter ? 'ring-1 ring-slate-900/10' : ''}`}
                onClick={() => setShowEpicDropdown((v) => !v)}
                type="button"
              >
                <Image
                  src={"/filter.svg"}
                  className="mr-2 dark:filter"
                  width={14}
                  alt={"filter"}
                  height={14}
                  priority
                />
                {selectedEpicFilter ? (epics.find(e => e.epic_id === selectedEpicFilter)?.title || 'Epic') : 'Filter Epics'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              <AnimatePresence>
                {showEpicDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="absolute right-0 z-20 mt-2 w-64 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-2 rounded-md shadow-lg transition-colors duration-300"
                  >
                    <button
                      className="w-full text-left text-sm px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
                      onClick={() => { setSelectedEpicFilter(null); setShowEpicDropdown(false); }}
                    >
                      All Epics
                    </button>
                    {epics.map(epic => (
                      <button
                      key={epic.epic_id}
                      className={`w-full text-left px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center space-x-2 transition-colors duration-200 ${selectedEpicFilter === epic.epic_id ? 'bg-gray-200 dark:bg-black' : ''}`}
                      onClick={() => { setSelectedEpicFilter(epic.epic_id); setShowEpicDropdown(false); }}
                    >
                      {/* Circle */}
                      <span
                        className={`${getEpicColor(epic.epic_id)} w-3 h-3 rounded-full inline-block`}
                      ></span>
                    
                      {/* Text */}
                      <span className="text-sm text-gray-600 dark:text-gray-100">{epic.title}</span>
                    </button>                    
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* End Epic Filter Dropdown */}
            <button
              onClick={navigateToEpics}
              className="flex flex-row bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 items-center px-3 py-2 text-gray-700 dark:text-gray-100 tracking-tight text-sm transition-colors duration-200 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-900 shadow-sm"
            >
              <Image
                src="/epic.svg"
                className="mr-2 dark:filter"
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
              userId={userID}
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
              onDueDateUpdate={(taskId, dueDate) => updateTaskDueDate(taskId, dueDate)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Epic Assignment Modal */}
      <AnimatePresence>
      {isEpicModalOpen && (
        <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-xl transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-800 mb-4 transition-colors duration-300">
              Assign Epic
            </h2>

            <p className="text-gray-600 dark:text-gray-200 mb-4 transition-colors duration-300">
              Assign "{selectedTaskForEpic?.tasks?.title || selectedTaskForEpic?.title}" to an epic:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {epics.map((epic) => (
                <button
                  key={epic.epic_id}
                  onClick={() => assignEpicToTask(epic.epic_id)}
                  className="w-full text-left p-3 bg-gray-100 dark:bg-black border border-gray-300 dark:border-neutral-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`${getEpicColor(epic.epic_id)} px-2 py-1 rounded-full text-xs`}>
                      {epic.name}
                    </span>
                    <span className="text-slate-800 font-medium">{epic.name}</span>
                  </div>
                  {epic.description && (
                    <div className="text-gray-600 dark:text-gray-200 text-sm mt-1 transition-colors duration-300">{epic.description}</div>
                  )}
                  <div className="text-gray-500 dark:text-gray-300 text-xs mt-1 transition-colors duration-300">{epic.task_count} tasks</div>
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
                className="px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Kanban Board */}
        <div className="flex flex-1 gap-4 overflow-x-auto">
        <motion.div className="flex flex-row gap-4 w-full">
          {['Backlog', 'To Do', 'In Progress', 'Done'].map((status) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${columnColors[status]} rounded-md p-4 flex flex-col min-h-[600px] flex-1 min-w-[300px] border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 shadow-sm transition-colors duration-300`}
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
                  <div
  className={`text-xs text-gray-800 dark:text-gray-200 
              border border-gray-200 dark:border-neutral-800
              bg-gray-50 dark:bg-neutral-950 
              px-2 py-1 rounded-full font-medium 
              transition-colors duration-300`}
>
                    {getTasksByStatus(status).length}
                  </div>
                </div>
              </div>
      
              {/* Task List */}
              <div
                className={`flex-1 space-y-3 transition-colors overflow-y-auto ${dragOverColumn === status ? 'bg-gray-100 dark:bg-black rounded-xl' : ''}`}
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
                    className={`p-3 bg-white/60 dark:bg-neutral-900/40 rounded-md shadow-sm border ${borderColors[status]} transition-all duration-150 ease-in-out cursor-pointer hover:border-neutral-600`}
                    draggable="true"
                    onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex flex-col gap-1/2">
                      {/* Epic Badge and Due Date at the top */}
                      {(task.tasks.taskEpics?.[0]?.epics?.title || task.tasks?.due_date) && (
                        <div className="flex items-center space-x-1 mb-1 justify-between">
                          <div className="flex items-center space-x-1">
                            {task.tasks.taskEpics?.[0]?.epics?.title && (
                              <>
                                <div className={`w-2 h-2 rounded-full ${getEpicColor(task.tasks.taskEpics[0].epics.epic_id)}`}></div>
                                <span className="text-xs tracking-tight font-normal text-gray-700 dark:text-gray-400">
                                  {task.tasks.taskEpics[0].epics.title}
                                </span>
                              </>
                            )}
                          </div>

                          {task.tasks?.due_date && (
                            <p className={`text-xs tracking-tight font-normal ${task.tasks.due_date_color || 'text-gray-400'}`}>
                              {task.tasks.relative_due_date || 'Due Date'}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-gray-700 dark:text-gray-100 text-sm tracking-tight leading-relaxed mb-1">
                        {task.tasks?.title || task.title || 'UNKNOWN'}
                      </p>

                      {/* Labels and Priority at the bottom */}
                      <div className="flex flex-row items-center justify-between">
                        {task.tasks?.task_labels && task.tasks.task_labels.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {task.tasks.task_labels.map((labelItem) => (
                              <LabelBadge
                                key={labelItem.label_id}
                                label={labelItem}
                                size="xs"
                                className="text-xs"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-xs">No Labels</span>
                          </div>
                        )}

                        {/* Priority */}
                        <div className="flex items-center space-x-2">
                        {(() => {
                          const priorityRaw = task.tasks?.priority || task.priority || 'No Priority';
                          const normalizedPriority = typeof priorityRaw === 'string' ? priorityRaw.toLowerCase() : priorityRaw;
                          const config = priorityConfig[normalizedPriority] || priorityConfig['no priority'];

                          return (
                            <div className={`
                              inline-flex items-center gap-1 px-2 py-1/2 rounded-md
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
                    className="p-3 bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-gray-300 text-gray-900 dark:text-gray-100 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 shadow-sm transition-colors duration-300"
                    placeholder="Add new task..."
                  />
                ) : (
                  <button
                    className="flex w-full text-sm rounded-xl items-center text-gray-500 dark:text-gray-300 p-3 hover:bg-gray-100 dark:hover:bg-black transition-colors duration-200 ease-in-out border-2 border-dashed border-gray-300 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-gray-300"
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

      {deletionNotification && (
        <div
          className="fixed bottom-4 right-4 bg-gray-800 dark:bg-slate-900 border border-gray-200 dark:border-black/10 text-white px-4 py-2 rounded-xl shadow-lg z-50 transition-all duration-300 ease-in-out"
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