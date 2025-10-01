"use server";
import { 
  createLabel, 
  getUserLabels, 
  updateLabel, 
  deleteLabel, 
  assignLabelToTask, 
  removeLabelFromTask, 
  getTaskLabels, 
  getTasksWithLabels 
} from "../lib/db/queries";

// Label Management Server Actions

export async function createLabelAction(userId: string, name: string, color: string) {
  return await createLabel(userId, name, color);
}

export async function getUserLabelsAction(userId: string) {
  return await getUserLabels(userId);
}

export async function updateLabelAction(labelId: string, name: string, color: string) {
  return await updateLabel(labelId, name, color);
}

export async function deleteLabelAction(labelId: string) {
  return await deleteLabel(labelId);
}

export async function assignLabelToTaskAction(taskId: string, labelId: string) {
  return await assignLabelToTask(taskId, labelId);
}

export async function removeLabelFromTaskAction(taskId: string, labelId: string) {
  return await removeLabelFromTask(taskId, labelId);
}

export async function getTaskLabelsAction(taskId: string) {
  return await getTaskLabels(taskId);
}

export async function getTasksWithLabelsAction(userId: string, taskType?: string) {
  return await getTasksWithLabels(userId, taskType);
}
