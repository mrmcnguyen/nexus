import React, { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { getAllProjects } from "../../../lib/db/projectQueries";
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
        const res = await getAllProjects(userID);
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
      <div className="min-h-screen p-8 text-white">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
              <FiFolder className="mr-4 text-[#91C8FF]" size={40} />
              Your Projects
            </h1>
            <Link
              href="./createTeam"
              className="bg-[#6f99d8] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
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

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <h2 className="text-2xl mb-4">No Projects Found</h2>
              <p>Create a new project to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredProjects.map((project, index) => (
    <div
      key={index}
      className="bg-[#1f1f1f] border border-[#333] rounded-xl p-6 hover:border-blue-500 transition duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer w-full max-w-[320px] mx-auto"
      onClick={() => handleProjectClick(project.project_id)}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">{project.project_name}</h2>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
          Active
        </span>
      </div>
      <p className="text-gray-400 mb-4">{project.organisation_name}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Team Members: 4</span>
        <button className="text-blue-500 hover:text-blue-600 transition">
          View Details
        </button>
      </div>
    </div>
  ))}
</div>

          )}
        </div>
      </div>
    )
  );
}
