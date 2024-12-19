"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { addKanbanTask, editTaskDescription, editTaskName, getKanbanTasks, updateKanbanTaskState } from "../../../lib/db/queries";
import { createClient } from "../../../../supabase/client";
import Loading from "./loading";
import TaskModal from "./taskModal";
import { getProjectByID } from "../../../lib/db/projectQueries";

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

    const headerColors = {
      'Backlog' : 'text-gray-400',
      'To Do': 'text-yellow-200',
      'In Progress': 'text-blue-200',
      'Done' : 'text-emerald-200'
    }

    const borderColors = {
      'Backlog' : 'border-gray-600',
      'To Do': 'border-yellow-500',
      'In Progress': 'border-blue-300',
      'Done' : 'border-emerald-300'
    }

  const supabase = createClient();
  const dropdownRef = useRef(null);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      const res = await getProjectByID('0080d2ed-4bde-41f2-a819-ee5ce7fd456e');
      console.log(res);
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

  const handleMoveTask = async(newStatus, task) => {

    // Check if dropped over the same column
    let taskCol = task.status || task.tasks?.status;
    if (taskCol === newStatus){
      return; // End early and don't do anything if dragger over the same column
    }

    let taskId = task.task_id || task.tasks?.task_id;

    let res = await updateKanbanTaskState(taskId, newStatus);
    if (!res){
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
            
            // Find the task in the current state and update its description
            for (const status in updatedTasks) {
                const index = updatedTasks[status].findIndex(
                    (t) => t.task_id === taskId || t.tasks?.task_id === taskId
                );
                
                if (index > -1) {
                    // Get task status
                    let state = updatedTasks[status][index].status;

                    // Update the task entry with the new updated returned row
                    updatedTasks[status][index] = res[0];

                    // Add status to task object, since tasks table does not return status attribute
                    updatedTasks[status][index].status= state;
                    break;
                }
            }
            console.log(updatedTasks);
            return updatedTasks;
        });
    }
};

const updateTaskTitle = async (task, title) => {

  console.log(task, title);
  const taskId = task.task_id || task.tasks?.task_id;

  const res = await editTaskName(taskId, title);
  if (res[0]) {
      setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          
          // Find the task in the current state and update its description
          for (const status in updatedTasks) {
              const index = updatedTasks[status].findIndex(
                  (t) => t.task_id === taskId || t.tasks?.task_id === taskId
              );
              
              if (index > -1) {
                // Get task status
                let state = updatedTasks[status][index].status;

                // Update the task entry with the new updated returned row
                updatedTasks[status][index] = res[0];

                // Add status to task object, since tasks table does not return status attribute
                updatedTasks[status][index].status= state;
                break;
              }
          }
          
          console.log(updatedTasks);
          return updatedTasks;
      });
  }
};

  const handleKeyDown = (e, status) => {
    if (e.key === "Enter") {
      handleAddTask(e, status);
    } else if (e.key === "Escape") {
      setEditingColumn(null);
    }
  };

  const handleDrop = (status, e) => {
    console.log("DROPPED");
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData('task'));
    handleMoveTask(status, task);
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
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

  if (isLoading || !tasks) {
    return <Loading />;
  }

  return (
    <div className="p-8 pt-4 min-h-screen flex flex-col bg-[#171717]">
        <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex flex-row items-center">
                <h1 className="text-5xl text-gray-300 font-black text-left lg:text-4xl md:text-3xl 2xl:text-4xl">Personal Kanban Board</h1>
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
              />)}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 h-[calc(100vh-140px)]">
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
              <div className="flex flex-row w-full justify-between">
              <h2 className={`lg:text-lg 2xl:text-xl ${headerColors[status]} font-black`}>{status}</h2>
              <div className={`lg:text-lg 2xl:text-xl text-gray-400 font-light`}>{getTasksByStatus(status).length}</div>
              </div>
            </div>

            {/* Task List */}
            <div className={`flex-grow rounded overflow-y-auto transition-colors ${
                dragOverColumn === status ? 'bg-[#1f1f1f]' : ''
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
                  key={task.tasks?.task_id || task.task_id || "UNKNOWN"}
                  className={`p-4 bg-[#292929] rounded shadow lg:mb-1 2xl:mb-2 border border-[#454545] rounded border-s-4 ${borderColors[status]} hover:opacity-80 transition duration-200 ease-in-out`}
                  draggable="true"
                  onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))}
                  onClick={() => handleTaskClick(task)}
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
                  className="p-2 mt-2 bg-[#292929] lg:text-sm 2xl:text-base text-gray-400 w-full rounded focus-visible:outline-none"
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
        ))}
      </div>
    </div>
);
}
