"use server";
import { 
  getEpics, 
  addEpic, 
  updateEpic, 
  deleteEpic, 
  getEpicTasks, 
  assignTaskToEpic, 
  removeTaskFromEpic, 
  getEpicsWithTaskCounts, 
  getTaskEpic 
} from "../lib/db/epicQueries";

// Epic Management Server Actions

export async function getEpicsAction(userId: string) {
  return await getEpics(userId);
}

export async function addEpicAction(userId: string, name: string, description?: string) {
  return await addEpic(userId, name, description);
}

export async function updateEpicAction(epicId: string, name: string, description?: string) {
  return await updateEpic(epicId, name, description);
}

export async function deleteEpicAction(epicId: string) {
  return await deleteEpic(epicId);
}

export async function getEpicTasksAction(epicId: string) {
  return await getEpicTasks(epicId);
}

export async function assignTaskToEpicAction(taskId: string, epicId: string) {
  return await assignTaskToEpic(taskId, epicId);
}

export async function removeTaskFromEpicAction(taskId: string, epicId: string) {
  return await removeTaskFromEpic(taskId, epicId);
}

export async function getEpicsWithTaskCountsAction(userId: string) {
  return await getEpicsWithTaskCounts(userId);
}

export async function getTaskEpicAction(taskId: string) {
  return await getTaskEpic(taskId);
}
