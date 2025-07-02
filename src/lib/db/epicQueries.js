import { createClient } from "../../../supabase/client";

// Get all epics for a user
export async function getEpics(userId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('epics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching epics:', error);
        return null;
    }

    return data;
}

// Add a new epic
export async function addEpic(userId, name, description = '') {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('epics')
        .insert({
            user_id: userId,
            title: name,
            description: description,
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding epic:', error);
        return { success: false, error };
    }

    return { success: true, data };
}

// Update an epic
export async function updateEpic(epicId, name, description = '') {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('epics')
        .update({
            title: name,
            description: description,
            updated_at: new Date().toISOString()
        })
        .eq('epic_id', epicId)
        .select()
        .single();

    if (error) {
        console.error('Error updating epic:', error);
        return { success: false, error };
    }

    return { success: true, data };
}

// Delete an epic
export async function deleteEpic(epicId) {
    const supabase = createClient();

    // First, remove all task-epic associations
    const { error: taskEpicError } = await supabase
        .from('taskEpics')
        .delete()
        .eq('epic_id', epicId);

    if (taskEpicError) {
        console.error('Error removing task-epic associations:', taskEpicError);
        return { success: false, error: taskEpicError };
    }

    // Then delete the epic
    const { error } = await supabase
        .from('epics')
        .delete()
        .eq('epic_id', epicId);

    if (error) {
        console.error('Error deleting epic:', error);
        return { success: false, error };
    }

    return { success: true };
}

// Get tasks for a specific epic
export async function getEpicTasks(epicId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('taskEpics')
        .select(`
            epic_id,
            tasks (
            task_id,
            title,
            description,
            created_at,
            updated_at,
            priority,
            kanbanTasks (
                status
            )
            )
        `)
        .eq('epic_id', epicId);

    if (error) {
        console.error('Error fetching epic tasks:', error);
        return null;
    }

    console.log(data);

    // Transform the data to include status information
    return data.map(item => ({
        ...item.tasks,
        status: item.tasks?.kanbanTasks[0]?.status || 'Unknown'
    }));
}

// Assign a task to an epic
export async function assignTaskToEpic(taskId, epicId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('taskEpics')
        .insert({
            task_id: taskId,
            epic_id: epicId
        })
        .select()
        .single();

    if (error) {
        console.error('Error assigning task to epic:', error);
        return { success: false, error };
    }

    return { success: true, data };
}

// Remove a task from an epic
export async function removeTaskFromEpic(taskId, epicId) {
    const supabase = createClient();

    const { error } = await supabase
        .from('taskEpics')
        .delete()
        .eq('task_id', taskId)
        .eq('epic_id', epicId);

    if (error) {
        console.error('Error removing task from epic:', error);
        return { success: false, error };
    }

    return { success: true };
}

// Get all epics with task counts
export async function getEpicsWithTaskCounts(userId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('epics')
        .select(`
            *,
            taskEpics (
                task_id
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching epics with task counts:', error);
        return null;
    }

    // Add task count to each epic
    return data.map(epic => ({
        ...epic,
        task_count: epic.taskEpics?.length || 0
    }));
}

// Get epic for a specific task
export async function getTaskEpic(taskId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('taskEpics')
        .select(`
            epic_id,
            epics (
                epic_id,
                title,
                description
            )
        `)
        .eq('task_id', taskId)
        .single();

    if (error) {
        console.error('Error fetching task epic:', error);
        return null;
    }

    return data?.epics || null;
} 