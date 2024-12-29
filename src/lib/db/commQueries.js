import { createClient } from "../../../supabase/client";

const supabase = createClient();

export async function sendInvite(a_sender_id, a_custom_message, a_recipient_email, a_project_id, a_project_name, a_organisation_name, a_recipient_id, a_sender_name){

    console.log(a_sender_id, a_custom_message, a_recipient_email, a_project_id);

    const { data, error } = await supabase
    .from('invitations')
    .insert({ sender_id: a_sender_id,
        status: 'PENDING',
        recipient_email: a_recipient_email,
        project_id: a_project_id,
        project_name: a_project_name,
        organisation_name: a_organisation_name,
        custom_message: a_custom_message,
        recipient_id: a_recipient_id,
        sender_name: a_sender_name
        });

    if (error) {
        console.error(error); // Logs the error to the console
        return false; // Returns false if there is an error
    } else {
        console.log(data); // Logs the inserted data to the console
        return true; // Returns true if the insertion is successful
    }
}