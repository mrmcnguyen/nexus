"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addKanbanTask, editTaskDescription, editTaskName, getKanbanTasks, updateKanbanTaskState, updateTaskPriority } from "../../../lib/db/queries";
import { getEpicsWithTaskCounts, assignTaskToEpic, removeTaskFromEpic, getTaskEpic } from "../../../lib/db/epicQueries";
import { createClient } from "../../../../supabase/client";
import Loading from "./loading";
import TaskModal from "./taskModal";

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
    'Backlog': 'text-gray-400',
    'To Do': 'text-yellow-200',
    'In Progress': 'text-blue-200',
    'Done': 'text-emerald-200'
  }

  const borderColors = {
    'Backlog': 'border-gray-600',
    'To Do': 'border-yellow-500',
    'In Progress': 'border-blue-300',
    'Done': 'border-emerald-300'
  }

  // Sleek, professional priority badge styles
  const priorityColors = {
    Critical: 'bg-red-600/20 border border-red-500/30 text-red-400',
    High: 'bg-orange-500/20 border border-orange-500/30 text-orange-400',
    Medium: 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400',
    Low: 'bg-blue-500/20 border border-blue-500/30 text-blue-400',
    'No Priority': 'bg-gray-600/20 border border-gray-500/30 text-gray-400'  // Fallback color
  };

  const priorityLabels = {
    Critical: 'text-red-400',
    High: 'text-orange-400',
    Medium: 'text-yellow-400',
    Low: 'text-blue-400',
    'No Priority': 'text-gray-400'  // Fallback text color
  };

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
    setDeletionNotification(task);

    // Clear notification after 3 seconds
    const timer = setTimeout(() => {
      setDeletionNotification(null);
    }, 3000);

    // Cleanup the timer if component unmounts
    return () => clearTimeout(timer);
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
      <div className="bg-[#1f1f1f] border border-[#2E2E2E] rounded-md p-6 h-[calc(100vh-140px)] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-200">All Tasks ({allTasks.length})</h2>
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex items-center space-x-2 bg-blue-700 border border-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition duration-200"
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
          <p className="text-gray-400 text-sm">Tasks organized by status and creation date</p>

          {/* Quick Add Task Form */}
          {isAddingTask && (
            <form onSubmit={handleAddTaskToList} className="mt-4 p-4 bg-[#292929] border border-[#454545] rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Enter task title..."
                  className="flex-1 bg-[#1f1f1f] border border-[#454545] rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-green-700 border border-green-500 hover:bg-green-900 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskInput("");
                  }}
                  className="bg-gray-600 border border-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-3">
          {allTasks.map((task) => {
            const taskId = task.tasks?.task_id || task.task_id;
            const title = task.tasks?.title || task.title;
            const description = task.tasks?.description || task.description;
            const priority = task.tasks?.priority || task.priority || 'No Priority';
            const createdAt = task.tasks?.created_at || task.created_at;

            return (
              <div
                key={taskId}
                className="bg-[#292929] rounded-lg p-4 hover:bg-[#353535] transition duration-200 cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'Done' ? 'bg-green-600 text-green-100' :
                        task.status === 'In Progress' ? 'bg-blue-600 text-blue-100' :
                          task.status === 'To Do' ? 'bg-yellow-600 text-yellow-100' :
                            'bg-gray-600 text-gray-100'
                        }`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
                        {priority}
                      </span>
                      {task.epic && (
                        <span className={`${getEpicColor(task.epic.epic_id)} px-2 py-1 rounded-full text-xs`}>
                          {task.epic.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-gray-200 font-medium mb-1">{title}</h3>

                    {description && (
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
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
                      className="text-green-400 hover:text-green-300 transition duration-200"
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
              </div>
            );
          })}
        </div>

        {allTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No tasks found</div>
            <p className="text-gray-500 text-sm">Create your first task to get started</p>
          </div>
        )}
      </div>
    );
  };

  if (isLoading || !tasks) {
    return <Loading />;
  }

  return (
    <div className="p-8 pt-4 min-h-screen flex flex-col bg-[#171717]">
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="flex flex-row items-center">
          <h1 className="text-5xl text-gray-300 font-black text-left lg:text-4xl md:text-3xl 2xl:text-4xl">Personal Kanban Board</h1>
          <span className="flex flex-row items-center m-4 border border-[#2F2F2F] bg-gradient-to-br from-[#1f1f1f] text-gray-400 text-xs rounded-2xl px-2">
            <Image
              src="/synced.svg"
              width={14}
              className="mr-1 mt-1 mb-1"
              height={14}
              alt="t"
              priority
            />
            Synced
          </span>
        </div>
        <div className="flex flex-row space-x-4">
          {/* Epic Filter Dropdown */}
          <div className="relative">
            <button
              className={`flex flex-row items-center border border-[#2F2F2F] bg-[#1f1f1f] px-4 py-2 text-gray-300 rounded-lg hover:bg-[#232323] transition duration-200 ${selectedEpicFilter ? 'text-light border-blue-500' : ''}`}
              onClick={() => setShowEpicDropdown((v) => !v)}
              type="button"
            >
              <Image
                src={"/filter.svg"}
                style={{ filter: 'invert(1)' }}
                className="mr-2"
                width={14}
                alt={"filter"}
                height={14}
                priority
              />
              {selectedEpicFilter ? (epics.find(e => e.epic_id === selectedEpicFilter)?.title || 'Epic') : 'Filter by Epic'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Dropdown */}
            {showEpicDropdown && (
              <div
                className="absolute z-20 mt-2 w-64 bg-[#232323] lg:text-sm 2xl:text-base border border-[#444] rounded-lg shadow-xl transition-all duration-200 ease-out origin-top opacity-100 scale-100 translate-y-0 animate-epic-dropdown"
                style={{
                  animation: 'epicDropdownFadeIn 0.18s cubic-bezier(0.4,0,0.2,1)'
                }}
              >
                <button
                  className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#333] rounded-t-lg"
                  onClick={() => { setSelectedEpicFilter(null); setShowEpicDropdown(false); }}
                >
                  All Epics
                </button>
                {epics.map(epic => (
                  <button
                    key={epic.epic_id}
                    className={`w-full text-left px-4 py-2 hover:bg-[#333] flex items-center space-x-2 ${selectedEpicFilter === epic.epic_id ? 'bg-blue-900/30' : ''}`}
                    onClick={() => { setSelectedEpicFilter(epic.epic_id); setShowEpicDropdown(false); }}
                  >
                    <span className={`${getEpicColor(epic.epic_id)} px-2 py-1 rounded-full text-xs`}>{epic.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* End Epic Filter Dropdown */}
          <button
            onClick={toggleViewMode}
            className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#333]"
          >
            <Image
              src={viewMode === 'kanban' ? "/list.svg" : "/todo.svg"}
              style={{ filter: 'invert(1)' }}
              className="mr-2"
              width={14}
              alt={viewMode === 'kanban' ? "list" : "kanban"}
              height={14}
              priority
            />
            {viewMode === 'kanban' ? 'View as List' : 'View as Kanban'}
          </button>
          <button
            onClick={navigateToEpics}
            className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#333]"
          >
            <Image
              src="/epic.svg"
              style={{ filter: 'invert(1)' }}
              className="mr-2"
              width={14}
              alt="team"
              height={14}
              priority
            />
            Manage Epics
          </button>
        </div>
      </div>

      {isModalOpen && (<TaskModal
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
      />)}

      {/* Epic Assignment Modal */}
      {isEpicModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] border border-[#2F2F2F] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Assign Epic
            </h2>

            <p className="text-gray-400 mb-4">
              Assign "{selectedTaskForEpic?.tasks?.title || selectedTaskForEpic?.title}" to an epic:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {epics.map((epic) => (
                <button
                  key={epic.epic_id}
                  onClick={() => assignEpicToTask(epic.epic_id)}
                  className="w-full text-left p-3 bg-[#292929] border border-[#454545] rounded-lg hover:bg-[#353535] transition duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`${getEpicColor(epic.epic_id)} px-2 py-1 rounded-full text-xs`}>
                      {epic.name}
                    </span>
                    <span className="text-gray-200 font-medium">{epic.name}</span>
                  </div>
                  {epic.description && (
                    <div className="text-gray-400 text-sm mt-1">{epic.description}</div>
                  )}
                  <div className="text-gray-500 text-xs mt-1">{epic.task_count} tasks</div>
                </button>
              ))}
            </div>

            {epics.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No epics available. Create one first!
              </p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsEpicModalOpen(false);
                  setSelectedTaskForEpic(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-gray-200 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 border border-[#2E2E2E] rounded-md gap-2 h-[calc(100vh-140px)]">
          {['Backlog', 'To Do', 'In Progress', 'Done'].map((status, index) => (
            <div
              key={status}
              className={`p-4 flex flex-col overflow-y-auto ${index !== 0 ? 'border-l border-[#2E2E2E]' : '' // Add left border for all but the first column
                }`}
            >
              {/* Column Header */}
              <div className="flex flex-row items-center mb-4">
                <Image
                  src={`/${status.toLowerCase().replace(' ', '')}.svg`}
                  className="mr-2"
                  width={14}
                  height={14}
                  alt={status}
                  priority
                />
                <div className="flex flex-row w-full justify-between">
                  <h2 className={`lg:text-lg 2xl:text-xl ${headerColors[status]} font-black`}>
                    {status}
                  </h2>
                  <div className={`lg:text-lg 2xl:text-xl text-gray-400 font-light`}>
                    {getTasksByStatus(status).length}
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div
                className={`flex-grow rounded overflow-y-auto transition-colors ${dragOverColumn === status ? 'bg-[#1f1f1f]' : ''
                  }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  handleDrop(status, e);
                  setDragOverColumn(null); // Reset the drag-over state
                }}
                onDragEnter={() => setDragOverColumn(status)}
                onDragLeave={() => setDragOverColumn(null)}
              >
                {getTasksByStatus(status).map((task) => (
                  <div
                    key={task.tasks?.task_id || task.task_id || 'UNKNOWN'}
                    className={`p-4  bg-[#1f1f1f] rounded shadow lg:mb-1 2xl:mb-2 border-[#454545] rounded border-s-4 ${borderColors[status]} hover:opacity-80 transition duration-200 ease-in-out`}
                    draggable="true"
                    onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex flex-col space-y-2">
                      <p className="text-gray-200">
                        {task.tasks?.title || task.title || 'UNKNOWN'}
                      </p>

                      {/* Epic Badge */}
                      {task.tasks.taskEpics?.[0]?.epics?.title && (
                        <div className="flex items-center space-x-1">
                          <div className={`${getEpicColor(task.tasks.taskEpics[0].epics.epic_id)} px-2 py-1 rounded-full text-xs`}>
                            {task.tasks.taskEpics[0].epics.title}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.tasks?.priority || task.priority || 'No Priority']}`}>
                          {task.tasks?.priority || task.priority || 'No Priority'}
                        </span>
                      </div>
                    </div>
                  </div>
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
                    className="p-2 mt-2 bg-[#292929] lg:text-sm 2xl:text-base text-gray-400 w-full rounded focus-visible:outline-none"
                    placeholder="Add new task..."
                  />
                ) : (
                  <button
                    className="flex w-full lg:text-sm 2xl:text-base rounded-lg items-center text-gray-400 p-2 mt-2 hover:bg-[#292929] transition duration-200 ease-in-out"
                    onClick={() => {
                      setEditingColumn(status);
                      setNewTaskTitle(''); // Reset input when opening
                    }}
                  >
                    Add Task
                    <Image
                      src="/plus.svg"
                      className="ml-2"
                      width={14}
                      height={14}
                      alt="Add Task"
                      priority
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ListView />
      )}

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
    </div>
  );
}

/*
@keyframes epicDropdownFadeIn {
  0% { opacity: 0; transform: translateY(-10px) scaleY(0.98); }
  100% { opacity: 1; transform: translateY(0) scaleY(1); }
}
*/
