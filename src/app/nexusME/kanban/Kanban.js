"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { addKanbanTask, getKanbanTasks } from "../../../lib/db/queries";
import { createClient } from "../../../../supabase/client";
import Loading from "./loading";

export default function KanbanComponent() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingColumn, setEditingColumn] = useState(null);
    const [isHovered, setIsHovered] = useState({});
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
    const [dropdownTaskId, setDropdownTaskId] = useState(null);

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

  // Helper to get tasks by status
  const getTasksByStatus = (status) => {
    if (status === "Backlog") return tasks.backlog;
    if (status === "To Do") return tasks.todo;
    if (status === "In Progress") return tasks.inprogress;
    if (status === "Done") return tasks.done;
    return [];
  };

  const handleAddTask = async (e, status) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const result = await addKanbanTask(userID, newTaskTitle, status, 'kanban');

      if (result.success) {
        const newTask = result.data;
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

  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      let movedTask;

      // Find and remove the task from its current status
      for (const status in updatedTasks) {
        const index = updatedTasks[status].findIndex((task) => task.id === taskId);
        if (index > -1) {
          [movedTask] = updatedTasks[status].splice(index, 1);
          break;
        }
      }

      // Add it to the new status
      if (movedTask) {
        movedTask.status = newStatus;
        updatedTasks[newStatus.toLowerCase().replace(" ", "")].push(movedTask);
      }

      return updatedTasks;
    });
  };

  const handleKeyDown = (e, status) => {
    if (e.key === "Enter") {
      handleAddTask(e, status);
    } else if (e.key === "Escape") {
      setEditingColumn(null);
    }
  };

  const handleHover = (status, isHovering) => {
    setIsHovered((prevState) => ({ ...prevState, [status]: isHovering }));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const toggleDropdown = (taskId) => {
    setDropdownTaskId(dropdownTaskId === taskId ? null : taskId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownTaskId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (isLoading || !tasks) {
    return <Loading />;
  }

  return (
    <div className="p-8 pt-4 min-h-screen flex flex-col bg-[#171717]">
        <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex flex-row items-center">
                <h1 className="text-5xl text-gray-300 font-normal text-left lg:text-4xl md:text-3xl 2xl:text-4xl">Kanban Board</h1>
                <span className="flex flex-row items-center m-4 border border-[#2F2F2F] bg-[#2F2F2F] text-gray-400 text-xs rounded-2xl px-2">
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
                <button className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]">
                    <Image
                        src="/list.svg"
                        style={{ filter: 'invert(1)' }}
                        className="mr-2"  
                        width={14}
                        alt="t"
                        height={14}
                        priority
                    />
                    View as List
                </button>
                <button className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]">
                    <Image
                        src="/team.svg" 
                        style={{ filter: 'invert(1)' }}
                        className="mr-2"  
                        width={14}
                        alt="team"
                        height={14}
                        priority
                    />
                    View Team Kanban Board
                </button>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
        {['Backlog', 'To Do', 'In Progress', 'Done'].map((status) => (
          <div
            key={status}
            className="p-4 rounded-lg flex flex-col overflow-y-auto"
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
              <h2 className="lg:text-lg 2xl:text-xl text-gray-300 font-black">{status}</h2>
            </div>

            {/* Task List */}
            <div className="flex-grow overflow-y-auto">
              {getTasksByStatus(status).map((task) => (
                <div
                  key={task.tasks?.task_id || task.task_id || "UNKNOWN"}
                  className="p-4 bg-[#292929] rounded-lg shadow lg:mb-2 2xl:mb-4 hover:bg-[#414141] transition duration-200 ease-in-out"
                >
                  <p className="text-gray-200">{task.tasks?.title || task.title || "UNKNOWN"}</p>
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
                  className="p-2 mt-2 bg-[#292929] lg:text-sm 2xl:text-base text-gray-400 w-full rounded-md focus-visible:outline-none"
                  placeholder="Add new task..."
                />
              ) : (
                <button
                  className="flex w-full lg:text-sm 2xl:text-base rounded-lg items-center text-gray-400 p-2 mt-2 hover:bg-[#292929] transition duration-200 ease-in-out"
                  onClick={() => {
                    setEditingColumn(status);
                    setNewTaskTitle(""); // Reset input when opening
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

        {/* Modal */}
        {isModalOpen && selectedTask && (
            <div className="fixed text-black inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                    <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
                    <p><strong>Status:</strong> {selectedTask.status}</p>
                    <button 
                        onClick={closeModal} 
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>
);
}
