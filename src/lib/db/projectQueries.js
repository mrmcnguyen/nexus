import { createClient } from "../../../supabase/client";

const supabase = createClient();

// // Creates a project and inserts it into the projects table
// export async function createProject(a_project_name, a_organisation_name, a_project_description, a_project_manager) {

//     const { data, error } = await supabase
//     .from('projects')
//     .insert({ project_name: a_project_name, organisation_name: a_organisation_name, project_description: a_project_description, project_manager: a_project_manager });

//     if (error) {
//         console.error(error); // Logs the error to the console
//         return false; // Returns false if there is an error
//     } else {
//         console.log(data); // Logs the inserted data to the console
//         return true; // Returns true if the insertion is successful
//     }
// }

// Creates a project and inserts it into the projects table
export async function createProject(a_project_name, a_organisation_name, a_project_description, a_project_manager) {
    // Step 1: Insert the project into the projects table

    console.log(a_project_name, a_organisation_name, a_project_description, a_project_manager);
    
    const { data:projectData, error: projectError } = await supabase
    .rpc('insert_project', {
    a_organisation_name: a_organisation_name, 
    a_project_description: a_project_description, 
    a_project_manager: a_project_manager, 
    a_project_name: a_project_name
    })

    // Check for errors in project insertion
    if (projectError) {
        console.error(projectError); // Logs the error to the console
        return false; // Returns false if there is an error
    }

    console.log("Project Data: ", projectData);

    // Step 2: Insert the project manager into the projectMembers table
    const { error: memberError } = await supabase
        .from('projectMembers')
        .insert({
            project_id: projectData.project_id, // Use the ID of the newly created project
            user_id: a_project_manager, // The project manager's user ID
            role: 'MANAGER', // Assign a role, e.g., 'manager'
            invited_by: a_project_manager
        });

    // Check for errors in project member insertion
    if (memberError) {
        console.error(memberError); // Logs the error to the console
        return false; // Returns false if there is an error
    }

    console.log('Project created and project manager added to projectMembers:', projectData); // Logs the inserted data
    return true; // Returns true if both insertions are successful
}

// export async function getAllProjects(a_user_id){

//     console.log(a_user_id);

//     const {data, error} = await supabase
//     .from('projects')
//     .select('*')
//     .eq('project_manager', a_user_id)

//     if (error){
//         console.error(error);
//     } else{
//         console.log(data);
//         return data;
//     }

// }

export async function getAllProjects(a_user_id) {
    console.log(a_user_id);

    // Step 2: Get projects where the user is a member
    const { data: memberProjects, error: memberError } = await supabase
        .from('projectMembers')
        .select('project_id')
        .eq('user_id', a_user_id);

    if (memberError) {
        console.error('Error fetching projects where user is a member:', memberError);
        return []; // Return an empty array if there's an error
    }

    console.log("MEMBER PROJECTS: ", memberProjects);

    // Step 3: Extract project IDs from memberProjects
    const memberProjectIds = memberProjects.map(pm => pm.project_id);

    console.log("MEMBER PROJECT IDs: ", memberProjectIds);

    // Step 4: Get projects where the user is a member and include project manager's name
    const { data: additionalProjects, error: additionalError } = await supabase
        .from('projects')
        .select('*, profiles(user_id, first_name, last_name)')
        .in('project_id', memberProjectIds);

    if (additionalError) {
        console.error('Error fetching additional projects where user is a member:', additionalError);
        return []; // Return an empty array if there's an error
    }

    console.log("???????????", additionalProjects);

    console.log('All projects for user:', additionalProjects);
    return additionalProjects; // Return the combined list of projects
}

export async function getProjectByID(a_project_id){ 

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
    .rpc('getmembers', {
    a_project_id: a_project_id
    })
    if (error){
        console.error(error);
    } else {
        console.log(data);
        return data;
    }
}

export async function getProjectManager(a_user_id){

    console.log("Manager", a_user_id);

    const { data, error } = await supabase
    .rpc('getProjectManager', {
      a_user_id
    })

    if (error){
        console.error(error);
    }
    console.log(data);
    return data;
}

export async function getNameFromEmail(a_email){

    console.log(a_email);

    let { data, error } = await supabase
    .rpc('search_profiles', {
    email_input: a_email
    })

    if (error) console.error(error)

    console.log(data);
    return data;
}

export async function getNameFromID(a_user_id){

    console.log(a_user_id);

    let { data, error } = await supabase
    .rpc('getNameFromID', {
    a_user_id
    })
    
    if (error) console.error(error)

    console.log(data);
    return data;
}

export async function addMembertoProject(a_invitation_id, a_recipient_id, a_sender_id, a_project_id) {
    // Check if entry with given invitation id has a field where recipient_id is equal to GIVEN recipient_id
    const { data: invitationData, error: invitationError } = await supabase
        .from('invitations')
        .select('*')
        .eq('invitation_id', a_invitation_id) // Ensure you are checking the correct invitation
        .eq('recipient_id', a_recipient_id);

    // Check for errors in the invitation query
    if (invitationError) {
        console.error('Error fetching invitation:', invitationError);
        return false;
    }

    // Check if the invitation exists
    if (invitationData.length > 0) {
        // Add member to project
        const { data: memberData, error: memberError } = await supabase
            .from('projectMembers')
            .insert({ project_id: a_project_id, user_id: a_recipient_id, role: 'MEMBER', invited_by: a_sender_id });

        // Check for errors in the member insertion
        if (memberError) {
            console.error('Error adding member to project:', memberError);
            return false;
        }
        return true; // Successfully added member
    } else {
        console.error('No matching invitation found for recipient:', a_recipient_id);
        return false; // No matching invitation
    }
}