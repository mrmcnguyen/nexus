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

// Helper function to calculate relative due date on server
function getRelativeDueDate(dueDate) {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    
    // Reset time to start of day for accurate day comparison
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        const daysOverdue = Math.abs(diffDays);
        if (daysOverdue === 1) return "Overdue by 1 day";
        if (daysOverdue <= 7) return `Overdue by ${daysOverdue} days`;
        if (daysOverdue <= 14) return `Overdue by ${Math.ceil(daysOverdue / 7)} week${Math.ceil(daysOverdue / 7) > 1 ? 's' : ''}`;
        return `Overdue by ${Math.ceil(daysOverdue / 30)} month${Math.ceil(daysOverdue / 30) > 1 ? 's' : ''}`;
    }
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays === 2) return "Due in 2 days";
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    if (diffDays <= 14) return `Due in ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays <= 21) return `Due in ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    
    // For dates more than 3 weeks away, show the actual date
    return due.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

// Helper function to get due date color based on urgency
function getDueDateColor(dueDate) {
    if (!dueDate) return "text-gray-400";
    
    const today = new Date();
    const due = new Date(dueDate);
    
    // Reset time to start of day for accurate day comparison
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-400"; // Overdue - red
    if (diffDays === 0) return "text-orange-400"; // Due today - orange
    if (diffDays <= 2) return "text-yellow-400"; // Due tomorrow or in 2 days - yellow
    if (diffDays <= 7) return "text-blue-400"; // Due within a week - blue
    return "text-gray-400"; // Due later - gray
}

export async function getKanbanTasks(a_user_id) {

    console.log("User ID: ", a_user_id);

    const supabase = createClient();

    const { data, error } = await supabase
        .from('kanbanTasks')
        .select(`
            status,
            tasks(
              task_id,
              title,
              description,
              created_at,
              updated_at,
              priority,
              due_date,
              taskEpics(
                epics(
                  epic_id,
                  title,
                  description
                )
              ),
              task_labels(
                label_id,
                labels(
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

    // Transform the data to include epic information and relative due date
    const transformedData = data.map(item => {
        const task = item.tasks;
        const relativeDueDate = getRelativeDueDate(task?.due_date);
        const dueDateColor = getDueDateColor(task?.due_date);
        
        return {
            ...item,
            epic: item.taskEpics?.[0]?.epics || null,
            tasks: {
                ...task,
                relative_due_date: relativeDueDate,
                due_date_color: dueDateColor
            }
        };
    });

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