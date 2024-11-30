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
        console.log("DATA", data);
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

// export async function getEisenhowerTasks(a_user_id){

//     const supabase = createClient();
//     const { data, error } = await supabase

// }