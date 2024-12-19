import { createClient } from "../../../supabase/client";

const supabase = createClient();

// Creates a project and inserts it into the projects table
export async function createProject(a_project_name, a_organisation_name, a_project_description, a_project_manager) {

    const { data, error } = await supabase
    .from('projects')
    .insert({ project_name: a_project_name, organisation_name: a_organisation_name, project_description: a_project_description, project_manager: a_project_manager });

    if (error) {
        console.error(error); // Logs the error to the console
        return false; // Returns false if there is an error
    } else {
        console.log(data); // Logs the inserted data to the console
        return true; // Returns true if the insertion is successful
    }
}

export async function getAllProjects(a_user_id){

    console.log(a_user_id);

    const {data, error} = await supabase
    .from('projects')
    .select('*')
    .eq('project_manager', a_user_id)

    if (error){
        console.error(error);
    } else{
        console.log(data);
        return data;
    }

}

export async function getProjectByID(a_project_id){ // Needs to use server client since it is being called from the server

    const {data, error} = await supabase
    .from('projects')
    .select('*')
    .eq('project_id', a_project_id)

    if (error){
        console.error(error); 
    } 
    console.log(data);
    return data;
}

export async function getSectors(a_project_id){

    const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .eq('project_id', a_project_id)

    if (error){
        console.error(error);
    } 
    console.log(data);
    return data;
}

export async function getMembers(a_project_id){

    const { data, error } = await supabase
    .from('teamMembership')
    .select('profiles(*)')
    .eq('project_id', a_project_id)

    if (error){
        console.error(error);
    }
    console.log(data);
    return data;
}

export async function getProjectManager(a_user_id){

    console.log("Manager", a_user_id);

    const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('user_id', a_user_id)

    if (error){
        console.error(error);
    }
    console.log(data);
    return data;
}