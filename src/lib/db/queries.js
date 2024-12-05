import { create } from "domain";
import { createClient } from "../../../supabase/client";
import { supabase } from "../../app/supabase/supabaseClient";

export async function fetchAllTasks(){
    const { data, error } = await supabase
    .from('tasks')
    .select('*');

    return data;
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
                    user_id: a_user_id
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

export async function getEisenhowerTaskByID(a_task_id, a_user_id){
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

export async function deleteEisenhowerTaskByID(a_task_id){
    console.log("Delete task with task id of :", a_task_id);
    const supabase = createClient();

    let { data, error } = await supabase
    .rpc('deleteEisenhowerTaskByID1', {
        a_task_id
    })
    if (error){
        console.error(error);
    } else{
        console.log("Task deleted", data);
    }
}

// export async function completeEisenhowerTaskByID(a_task_id){

// }