import { Erica_One } from "next/font/google";
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