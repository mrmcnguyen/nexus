'use client';
import DashboardHeader from "../dashboardHeader";
import Members from "./members";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../../../supabase/client";

export default function Page() {

    const [userID, setUserID] = useState(null);
    const params = useParams();
    const supabase = createClient();
    console.log(params);

    // Fetch user ID
    useEffect(() => {
      const fetchUser = async () => {
        const { data: user, error } = await supabase.auth.getUser();
        if (user) {
          setUserID(user.user.id);
        } else {
          console.error("Error while fetching user ID: ", error);
        }
      };

      fetchUser();
    }, []);

  return (
    <main className="flex flex-col h-full box-border">

        <div className="flex-none">
            <DashboardHeader id={params.id}
            />
          </div>

  <div className="flex flex-col flex-1 overflow-hidden">
    <div className="h-full overflow-y-auto">
      <Members id={params.id} userID={userID} />
    </div>
  </div>
</main>

  );
}