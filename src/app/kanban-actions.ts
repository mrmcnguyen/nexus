"use server";
import { getKanbanTasks, addKanbanTask, updateKanbanTaskState, deleteKanbanTaskByID, updateTaskPriority } from "../lib/db/kanbanQueries";

export async function fetchKanbanTasks(userID: string) {
  return await getKanbanTasks(userID);
}

export async function addKanbanTaskAction(userID: string, title: string, status: string, taskType: string) {
  return await addKanbanTask(userID, title, status, taskType);
}

export async function updateKanbanTaskStateAction(taskID: string, newStatus: string) {
  return await updateKanbanTaskState(taskID, newStatus);
}

export async function deleteKanbanTaskByIDAction(taskID: string) {
  return await deleteKanbanTaskByID(taskID);
}

export async function updateTaskPriorityAction(taskID: string, priority: string) {
  return await updateTaskPriority(taskID, priority);
}