'use client';
import { getProjectByID, getProjectManager } from "../../../../lib/db/projectQueries";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "../../../../../supabase/client";

export default function DashboardHeader({ id }) {

    console.log(id);
    const [project, setProject] = useState(null);
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const [userID, setUserID] = useState(null);
    const [notifs, setNotifs] = useState([]); // Store notifications
    const supabase = createClient();

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

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                // Fetch project data
                const projectData = await getProjectByID(id);
                setProject(projectData);

                // Fetch manager data
                const managerData = await getProjectManager(projectData[0].project_manager);
                console.log(managerData);
                setManager(managerData);
            } catch (error) {
                console.error("Failed to fetch project or manager data:", error);
            } finally {
                setLoading(false); // Stop the loading state
            }
        };

        if (id) fetchProjectData();
    }, [id]);

    const displayNotification = (invitation) => {
        // Update the state to show the new notification
        setNotifs((prev) => [...prev, invitation]);

        // Optional: Display a toast or an alert (you can use a library like react-toastify)
        alert(`New invitation received: ${invitation.project_name}`);
    };

    useEffect(() => {
        console.log(project);
    }, [project]);

    if (loading) {
        // Display a loading indicator while data is being fetched
        return (
            <div className="w-full shadow-sm rounded-lg mb-4">
                <div className="flex items-center justify-between">
                    <div className="text-gray-500">Loading project details...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full shadow-sm rounded-lg mb-4">
            <div className="flex items-center justify-between">
                {/* Organisation, Manager, and Status Info */}
                <div className="flex space-x-6">

                    {/* Project Name */}
                    <div>
                        <div className="text-xs text-gray-500">Project</div>
                        <h1 className="text-lg">{project[0].project_name || "N/A"}</h1>
                    </div>

                    {/* Organisation */}
                    <div>
                        <div className="text-xs text-gray-500">Organisation</div>
                        <h1 className="text-lg">{project[0].organisation_name || "N/A"}</h1>
                    </div>

                    {/* Project Manager */}
                    <div>
                        <div className="text-xs text-gray-500">Project Manager</div>
                        <h1 className="text-lg">{manager[0].first_name|| "N/A"} {manager[0].last_name || "N/A"}</h1>
                        {/* <h1 className="text-lg">{manager}</h1> */}
                    </div>

                    {/* Status */}
                    <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <h1
                            className={`text-lg ${
                                project[0].status === "ACTIVE"
                                    ? "text-emerald-300"
                                    : project?.status === "INACTIVE"
                                    ? "text-red-500"
                                    : project?.status === "PAUSED"
                                    ? "text-yellow-500" // Add color for PAUSED status
                                    : "text-gray-800"
                            }`} 
                        >
                            {project[0].status || "N/A"}
                        </h1>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                    {/* Notification Button */}
                    <div className="relative">
                        <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <Image
                                src={"/notification.svg"}
                                alt="Notification Bell Icon"
                                width={20}
                                height={20}
                                className="text-gray-600"
                            />
                        </button>
                        {notifs.length > 0 && (<span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>)}
                    </div>

                    {/* Account Button */}
                    <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                        <Image
                            src={"/accountBlue.svg"}
                            alt="Account Icon"
                            width={20}
                            height={20}
                            className="text-gray-600"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
