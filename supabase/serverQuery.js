import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,  // Note: use service role key, not anon key
    {
        auth: {
            persistSession: false,
        }
    }
)