import { createClient } from "../../../supabase/serverQuery";

export async function getProjectByID(a_project_id) { // Needs to use server client since it is being called from the server

    const supabase = createClient();

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('project_id', a_project_id)

    if (error) {
        console.error(error);
    }
    console.log(data);
    return data;
}