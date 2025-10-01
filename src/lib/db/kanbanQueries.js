import 'server-only';
import { createClient } from "../../../supabase/serverComponentClient";

// KANBAN QUERIES

export async function addKanbanTask(a_user_id, a_title, a_status, a_task_type) {

    const supabase = createClient();

    let a_created_at = new Date().toISOString();
    let a_updated_at = new Date().toISOString();

    let { data, error } = await supabase
        .rpc('addEisenhowerTask', {
            a_created_at,
            a_task_type,
            a_title,
            a_updated_at,
            a_user_id
        })
    if (error) console.error(error)
    else console.log(data);

    if (data) {  // Add to "Kanban" schema
        const taskId = data?.task_id; // Access the task_id from the returned data

        // Set default priority for new tasks
        const { error: priorityError } = await supabase
            .from('tasks')
            .update({ priority: 'No Priority' })
            .eq('task_id', taskId);

        if (priorityError) {
            console.error('Error setting default priority:', priorityError);
        }

        const { error: kanbanError } = await supabase
            .from('kanbanTasks')
            .insert(
                {
                    task_id: taskId,
                    status: a_status,
                    user_id: a_user_id,
                }
            );

        if (kanbanError) {
            console.error('Error adding task to kanbanTasks:', kanbanError);
            return { success: false, error: kanbanError };
        }

        console.log('Task added successfully:', data);
        data.status = a_status;
        data.priority = 'No Priority';
        return { success: true, data };
    } else {
        console.error('Error adding task:', error);
        return { success: false, error };
    }

}

export async function getKanbanTasks(a_user_id) {

    console.log("User ID: ", a_user_id);

    const supabase = createClient();

    const { data, error } = await supabase
        .from('kanbanTasks')
        .select(`
    status,
    tasks (
      task_id,
      title,
      description,
      created_at,
      updated_at,
      priority,
      taskEpics (
        epics (
          epic_id,
          title,
          description
        )
      ),
      task_labels (
        label_id,
        labels (
          label_id,
          name,
          color
        )
      )
    )
  `)
        .eq('user_id', a_user_id); // Filters for the specific user ID

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }

    // Transform the data to include epic information
    const transformedData = data.map(item => ({
        ...item,
        epic: item.taskEpics?.[0]?.epics || null
    }));

    console.log(transformedData)
    return transformedData;
}

export async function updateKanbanTaskState(a_task_id, a_new_state) {
    console.log(a_task_id, a_new_state);
    const supabase = createClient();

    let { data, error } = await supabase
        .rpc('updateKanbanTaskState', {
            a_new_state,
            a_task_id
        })
    if (error) console.error(error);
    else {
        console.log(data);
        return data;
    }
}

export async function deleteKanbanTaskByID(a_task_id) {

    const supabase = createClient();
    let { data, error } = await supabase
        .rpc('deleteKanbanTaskByID', {
            a_task_id
        })
    if (error) console.error(error)
    else {
        console.log(data);
        return data;
    }
}

export async function updateTaskPriority(a_task_id, a_priority) {
    const supabase = createClient();

    let { data, error } = await supabase
        .from('tasks')
        .update({ priority: a_priority })
        .eq('task_id', a_task_id)
        .select('*');

    if (error) {
        console.error('Error updating task priority:', error);
        return { success: false, error };
    } else {
        console.log('Task priority updated successfully:', data);
        return { success: true, data };
    }
}