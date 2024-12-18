import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { getAllProjects } from "../../../lib/db/projectQueries";


export default function AllTeams(){
    const [userID, setUserID] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const supabase = createClient();

      // Fetch user ID
      useEffect(() => {
        const fetchUser = async () => {
          const { data: user, error } = await supabase.auth.getUser();
          if (user) {
            setUserID(user.user.id);
          } else {
            console.error('Error while fetching user ID: ', error);
          }
        };
    
        fetchUser();
      }, []);
    
    useEffect(() => {
        const fetchAllProjects = async() => {
            const res = await getAllProjects(userID);
            if (res){
                setAllProjects(res);
            } else{
                console.error("Error while fetching all projects. Please check logs in supabase or in console.");
            }
        }

        if (userID !== null){
            fetchAllProjects();
        }
    }, [userID]);
    
    return (
        <>
        <div style={{ width: "50%", textAlign: "center", height: "50%", maxHeight: "50%"}}>
            <h1 className="w-full text-center text-gray-400 text-2xl md:text-4xl font-semibold mb-2">Your Projects</h1>
            <div className="w-75% flex flex-row max-w-full">
                {allProjects.map((project, index) => (
                    <div key={index}>{project.project_name}</div>
                ))}
            </div>
        </div>
        </>
    );
}