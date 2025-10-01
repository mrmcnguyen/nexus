'use client'
import { useEffect, useState, useRef } from "react";
import { getProjectByIDAction, getMembersAction } from "../../../../project-actions";
import { FiPlus, FiStar } from "react-icons/fi";

export default function DashboardMembers({ id }) {
    const [height, setHeight] = useState(null);
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const ref = useRef(); // Reference for the list element
    const headerRef = useRef(); // Reference for the header container (Team Members header and first column header)
    const columnHeaderRef = useRef();
    const parentRef = useRef(); // Reference for the parent div (to set maxHeight and handle overflow)

    const updateHeight = () => {
        if (ref.current && parentRef.current && headerRef.current && columnHeaderRef.current && height === null) {
            const totalHeight = parentRef.current.offsetHeight; // Total container height
            const columnHeaderHeight = columnHeaderRef.current.offsetHeight;
            const headerHeight = headerRef.current.offsetHeight; // Header height
            const paddingTop = parseFloat(window.getComputedStyle(parentRef.current).paddingTop);
            const paddingBottom = parseFloat(window.getComputedStyle(parentRef.current).paddingBottom);
            
            console.log(totalHeight, columnHeaderHeight, headerHeight);
            // Set the remaining height for the list
            setHeight(totalHeight - (headerHeight + columnHeaderHeight + paddingTop + paddingBottom));
        }
    }

    useEffect(() => {
          const getProject = async () => {
              try {
                  const res = await getProjectByIDAction(id); // Await the response
                  if (res) {
                      setProject(res);
                  }
              } catch (error) {
                  console.error("Failed to fetch project:", error);
              }
          };
      
          getProject();
      }, [id]); // Include `id` as a dependency
    
      useEffect(() => {
        const getProjectMembers = async () => {
            try {
                const res = await getMembersAction(id); // Await the response
                if (res) {
                    setMembers(res);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
            }
        };
    
        getProjectMembers();
    }, [project]); // Include `id` as a dependency

    useEffect(() => {
        updateHeight(); // Initial height calculation
        window.addEventListener('resize', updateHeight); // Recalculate on resize

        return () => {
            window.removeEventListener('resize', updateHeight); // Cleanup on unmount
        };
    }, [height]);

    return (
        <>
          {/* Members List */}
          <div ref={parentRef} className="p-4 h-full rounded-lg bg-[#1f1f1f] overflow-hidden">
            {/* Header Section */}
            <div ref={headerRef} className="flex flex-row w-full justify-between">
              <div>
                <h2 className="text-base 2xl:text-lg font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Team Members
                </h2>
              </div>
              <button className="flex flex-row bg-[#292929] items-center rounded-lg text-sm text-gray-400 border border-[#454545] p-1">
                Add Members
              </button>
            </div>
    
            {/* Table Headers */}
            <div ref={columnHeaderRef} className="grid grid-cols-4 gap-4 text-sm pl-2 font-light text-gray-500 border-b border-[#2f2f2f] py-2">
              <div>NAME</div>
              <div>SECTOR</div>
              <div>ROLE</div>
              <div>STATUS</div>
            </div>
    
            {/* Scrollable List of Members */}
            <div ref={ref} className="mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                    style={
                        height !== null
                          ? { maxHeight: `${height}px`, overflowY: 'auto' }
                          : {}
                    }
                >
            {members.length > 0 ? (
  members.map((member, index) => (
    <div
      key={index}
      className="grid grid-cols-4 gap-4 items-center py-2 pl-2 rounded-lg hover:bg-[#292929]"
    >
      <div className="text-sm text-gray-300 flex items-center">
        {member.first_name} {member.last_name}
        {member.role === "MANAGER" && (
          <span className="ml-2 text-yellow-300">
            <FiStar></FiStar>
          </span>
        )}
      </div>
      <div className="text-sm text-gray-300">{member.sector || "Not allocated"}</div>
      <div className="text-sm text-gray-300">{member.role}</div>
      <div
        className={`text-xs font-semibold uppercase ${
          member.status === "Online"
            ? "text-emerald-300"
            : member.status === "Offline"
            ? "text-red-700"
            : "text-[#91C8FF]"
        }`}
      >
        {member.status}
      </div>
    </div>
  ))
) : (
  <div className="text-gray-500 text-center py-4">
    This project has no members
  </div>
)}

            </div>
          </div>
        </>
      );
}



