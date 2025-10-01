import 'server-only'; 
import { createClient } from "../../../supabase/serverComponentClient";

export async function getUserFullName(a_user_id) {

    console.log('🔍 getUserFullName: a_user_id:', a_user_id);
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', a_user_id)

    if (error) {
        console.error(error)
    } else {
        console.log(data);
        return data;
    }
}