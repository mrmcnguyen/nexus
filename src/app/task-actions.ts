"use server";
import { editTaskName, editTaskDescription, editTaskDueDate } from "../lib/db/queries";

export async function editTaskNameAction(a_task_id, a_new_task_name) {
    return await editTaskName(a_task_id, a_new_task_name);
}

export async function editTaskDescriptionAction(a_task_id, a_description) {
    return await editTaskDescription(a_task_id, a_description);
}

export async function editTaskDueDateAction(a_task_id, a_due_date) {
    return await editTaskDueDate(a_task_id, a_due_date);
}

