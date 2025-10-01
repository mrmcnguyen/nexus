"use server";
import { 
  addUnallocatedEisenhowerTask, 
  allocateEisenhowerTask, 
  finishEisenhowerTask, 
  addEisenhowerTask, 
  getEisenhowerTasks, 
  getEisenhowerTaskByID, 
  deleteEisenhowerTaskByID, 
  getUnallocatedEisenhowerTasks 
} from "../lib/db/queries";

// Eisenhower Matrix Server Actions

export async function addUnallocatedEisenhowerTaskAction(userId: string, taskType: string, title: string) {
  return await addUnallocatedEisenhowerTask(userId, taskType, title);
}

export async function allocateEisenhowerTaskAction(taskId: string, matrixType: string) {
  return await allocateEisenhowerTask(taskId, matrixType);
}

export async function finishEisenhowerTaskAction(taskId: string) {
  return await finishEisenhowerTask(taskId);
}

export async function addEisenhowerTaskAction(userId: string, title: string, taskType: string, quadrant: string) {
  return await addEisenhowerTask(userId, title, taskType, quadrant);
}

export async function getEisenhowerTasksAction(userId: string) {
  return await getEisenhowerTasks(userId);
}

export async function getEisenhowerTaskByIDAction(taskId: string, userId: string) {
  return await getEisenhowerTaskByID(taskId, userId);
}

export async function deleteEisenhowerTaskByIDAction(taskId: string) {
  return await deleteEisenhowerTaskByID(taskId);
}

export async function getUnallocatedEisenhowerTasksAction(userId: string) {
  return await getUnallocatedEisenhowerTasks(userId);
}
