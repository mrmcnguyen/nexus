'use client';
import React, { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { getAllProjectsAction } from "../../project-actions";
import { FiFolder, FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import Link from "next/link";
import Loading from "./Loading";
import { useRouter } from "next/navigation";

export default function ProjectsDashboard() {
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();
  const router = useRouter();

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserID(data.user.id);
      } else {
        console.error("Error while fetching user ID:", error);
      }
    };

    fetchUser();
  }, [supabase]);

  // Fetch projects
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const res = await getAllProjectsAction(userID);
        if (res) {
          setAllProjects(res);
          setFilteredProjects(res);
        } else {
          console.error("Error while fetching all projects.");
        }
      } catch (error) {
        console.error("Error in fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userID) {
      fetchAllProjects();
    }
  }, [userID]);

  // Search and filter projects
  useEffect(() => {
    const filtered = allProjects.filter((project) =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.organisation_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, allProjects]);

  const handleProjectClick = (id) => {
    router.push(`/nexusTEAMS/projects/${id}`);
  };

  return (
    isLoading ? (
      <Loading />
    ) : (
      <div className="min-h-screen p-8 w-full text-white">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
              <FiFolder className="mr-4 text-[#91C8FF]" size={40} />
              All Projects
            </h1>
            <Link
              href="./createTeam"
              className="bg-[#6f99d8] hover:bg-[#91C8FF] text-white px-4 py-2 rounded-lg flex items-center transition"
            >
              <FiPlus className="mr-2" size={20} />
              New Project
            </Link>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 flex space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#91C8FF] text-white px-4 py-2 rounded-lg pl-10"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <button className="bg-[#1f1f1f] border border-[#333] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#2a2a2a] transition">
              <FiFilter className="mr-2" size={20} />
              Filters
            </button>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="bg-[#1f1f1f] border border-[#333] rounded-xl p-6 hover:border-[#91C8FF] transition duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                onClick={() => handleProjectClick(project.project_id)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">{project.project_name}</h2>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{project.organisation_name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Project Manager: {project.profiles.first_name || "Unknown"} {project.profiles.last_name || "Unknown"}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    )
  );
}