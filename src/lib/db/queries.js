import 'server-only'; 
import { createClient } from "../../../supabase/serverComponentClient";

export async function fetchAllTasks() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('tasks')
        .select('*');

    return data;
}

export async function editTaskName(a_task_id, a_new_task_name) {
    const supabase = createClient();
    let { data, error } = await supabase.
        from('tasks')
        .update({ title: a_new_task_name })
        .eq('task_id', a_task_id)
        .select('*')

    if (error) {
        console.error(error);
        return error;
    }
    console.log("Task name edited to", a_new_task_name);
    console.log(data);
    return data;
}

export async function editTaskDescription(a_task_id, a_description) {
    const supabase = createClient();
    let { data, error } = await supabase.
        from('tasks')
        .update({ description: a_description })
        .eq('task_id', a_task_id)
        .select('*')

    if (error) {
        console.error(error);
        return error;
    }
    console.log("Description name edited to", a_description);
    return data;
}

// EISENHOWER QUERIES

export async function addUnallocatedEisenhowerTask(a_user_id, a_task_type, a_title) {
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

    if (data) {  // Add to Eisenhower Matrix Table
        const taskId = data?.task_id; // Access the task_id from the returned data

        const { error: matrixError } = await supabase
            .from('eisenhowerMatrixTasks')
            .insert(
                {
                    task_id: taskId,
                    status: false,
                    user_id: a_user_id,
                    allocated: false
                }
            );

        if (matrixError) {
            console.error('Error adding task to eisenhowerMatrixTasks:', matrixError);
            return { success: false, error: matrixError };
        }

        console.log('Task added successfully:', data);
        return { success: true, data };
    } else {
        console.error('Error adding task:', error);
        return { success: false, error };
    }
}

export async function allocateEisenhowerTask(a_task_id, a_matrix_type) {

    console.log(a_matrix_type);

    const supabase = createClient();

    let { data, error } = await supabase
        .rpc('allocateEisenhowerTask', {
            a_matrix_type,
            a_task_id
        })
    if (error) console.error(error)
    else return data;

}

export async function finishEisenhowerTask(a_task_id) {

    const supabase = createClient();

    let { data, error } = await supabase
        .rpc('finishEisenhowerTask', {
            a_task_id
        })
    if (error) console.error(error)
    else return data;

}

// Function to add an Eisenhower Matrix task
export async function addEisenhowerTask(a_user_id, a_title, a_task_type, a_quadrant) {

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

    if (data) {  // Add to Eisenhower Matrix Table
        const taskId = data?.task_id; // Access the task_id from the returned data

        const { error: matrixError } = await supabase
            .from('eisenhowerMatrixTasks')
            .insert(
                {
                    task_id: taskId,
                    matrix_type: a_quadrant,
                    status: false,
                    user_id: a_user_id,
                    allocated: true
                }
            );

        if (matrixError) {
            console.error('Error adding task to eisenhowerMatrixTasks:', matrixError);
            return { success: false, error: matrixError };
        }

        console.log('Task added successfully:', data);
        return { success: true, data };
    } else {
        console.error('Error adding task:', error);
        return { success: false, error };
    }
}

export async function getEisenhowerTasks(a_user_id) {

    const supabase = createClient();

    const { data, error } = await supabase
        .from('eisenhowerMatrixTasks')
        .select(`
      matrix_type,
      status,
      allocated,
      tasks (
        task_id, 
        title,
        description,
        created_at,
        updated_at
      )
    `)
        .eq('user_id', a_user_id); // Filters for the specific user ID

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }
    console.log(data)
    return data;
}

export async function getEisenhowerTaskByID(a_task_id, a_user_id) {
    const supabase = createClient();

    let { data, error } = await supabase
        .rpc('getEisenhowerTaskByID', {
            a_task_id,
            a_user_id
        })
    if (error) console.error(error)
    else {
        console.log("Newly added task: ", data);
        return data;
    }

}

export async function deleteEisenhowerTaskByID(a_task_id) {
    console.log("Delete task with task id of :", a_task_id);
    const supabase = createClient();

    let { data, error } = await supabase
        .rpc('deleteEisenhowerTaskByID1', {
            a_task_id
        })
    if (error) {
        console.error(error);
    } else {
        console.log("Task deleted", data);
    }
}

// export async function completeEisenhowerTaskByID(a_task_id){

// }

export async function getUnallocatedEisenhowerTasks(a_user_id) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('eisenhowerMatrixTasks')
        .select(`
      matrix_type,
      status,
      allocated,
      tasks (
        task_id, 
        title,
        description,
        created_at,
        updated_at
      )
    `)
        .eq('user_id', a_user_id) // Filters for the specific user ID
        .eq('allocated', false); // Filters for tasks that are not allocated

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }
    console.log(data);
    return data;
}

// LABEL QUERIES

// Create a new label
export async function createLabel(a_user_id, a_name, a_color) {
    const supabase = createClient();

    let { data, error } = await supabase
        .from('labels')
        .insert({
            user_id: a_user_id,
            name: a_name,
            color: a_color,
            created_at: new Date().toISOString(),
        })
        .select('*');

    if (error) {
        console.error('Error creating label:', error);
        return { success: false, error };
    } else {
        console.log('Label created successfully:', data);
        return { success: true, data: data[0] };
    }
}

// Get all labels for a user
export async function getUserLabels(a_user_id) {
    const supabase = createClient();

    let { data, error } = await supabase
        .from('labels')
        .select('*')
        .eq('user_id', a_user_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching labels:', error);
        return null;
    } else {
        console.log('Labels fetched successfully:', data);
        return data;
    }
}

// Update a label
export async function updateLabel(a_label_id, a_name, a_color) {
    const supabase = createClient();

    let { data, error } = await supabase
        .from('labels')
        .update({
            name: a_name,
            color: a_color,
            updated_at: new Date().toISOString()
        })
        .eq('label_id', a_label_id)
        .select('*');

    if (error) {
        console.error('Error updating label:', error);
        return { success: false, error };
    } else {
        console.log('Label updated successfully:', data);
        return { success: true, data: data[0] };
    }
}

// Delete a label
export async function deleteLabel(a_label_id) {
    const supabase = createClient();

    // First, remove all task-label relationships
    const { error: taskLabelError } = await supabase
        .from('task_labels')
        .delete()
        .eq('label_id', a_label_id);

    if (taskLabelError) {
        console.error('Error removing task-label relationships:', taskLabelError);
        return { success: false, error: taskLabelError };
    }

    // Then delete the label
    let { data, error } = await supabase
        .from('labels')
        .delete()
        .eq('label_id', a_label_id)
        .select('*');

    if (error) {
        console.error('Error deleting label:', error);
        return { success: false, error };
    } else {
        console.log('Label deleted successfully:', data);
        return { success: true, data: data[0] };
    }
}

export async function assignLabelToTask(a_task_id, a_label_id) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from("task_labels")
      .insert({
        task_id: a_task_id,
        label_id: a_label_id,
        created_at: new Date().toISOString(),
      })
      .select("task_label_id, task_id, label_id, created_at"); // same as RETURNING
  
    if (error) {
      console.error(error);
      throw error;
    }
  
    return { success: true, data };
  }  

// Remove a label from a task
export async function removeLabelFromTask(a_task_id, a_label_id) {
    const supabase = createClient();

    let { data, error } = await supabase
        .from('task_labels')
        .delete()
        .eq('task_id', a_task_id)
        .eq('label_id', a_label_id)
        .select('*');

    if (error) {
        console.error('Error removing label from task:', error);
        return { success: false, error };
    } else {
        console.log('Label removed from task successfully:', data);
        return { success: true, data: data[0] };
    }
}

// Get labels for a specific task
export async function getTaskLabels(taskId) {
    const supabase = createClient();

    const { data: test1, error: error1 } = await supabase
    .from('task_labels')
    .select('*')
    .eq('task_id', '34742964-6b9b-4907-a366-fe3a53aee2ff');

    console.log('Test 1 - task_labels only:', test1, error1);

    const { data: test2, error: error2 } = await supabase
    .from('labels')
    .select('*');

    console.log('Test 2 - all labels:', test2, error2);
    
    const { data, error } = await supabase
      .from('task_labels')
      .select(`
        task_label_id,
        task_id,
        labels (
          label_id,
          name,
          color
        )
      `)
      .eq('task_id', taskId);
  
    if (error) {
      console.error('Error fetching task labels:', error);
      return null;
    }
    
    return data.map(item => ({
      task_label_id: item.task_label_id,
      task_id: item.task_id,
      label_id: item.labels.label_id,
      name: item.labels.name,
      color: item.labels.color
    }));
  }

// Get tasks with their labels for filtering
export async function getTasksWithLabels(a_user_id, a_task_type = null) {
    const supabase = createClient();

    let query = supabase
        .from('tasks')
        .select(`
            task_id,
            title,
            description,
            priority,
            created_at,
            updated_at,
            task_labels (
                label_id,
                labels (
                    label_id,
                    name,
                    color
                )
            )
        `)
        .eq('user_id', a_user_id);

    if (a_task_type) {
        query = query.eq('task_type', a_task_type);
    }

    let { data, error } = await query;

    if (error) {
        console.error('Error fetching tasks with labels:', error);
        return null;
    } else {
        console.log('Tasks with labels fetched successfully:', data);
        return data;
    }
}
