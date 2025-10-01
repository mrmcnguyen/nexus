'use client'
import { useEffect, useState, useRef } from "react";
import { getProjectByIDAction, getMembersAction } from "../../../../project-actions";
import { FiPlus, FiSearch } from "react-icons/fi";

export default function Sectors({ id, userID }) {
    const [height, setHeight] = useState(null);
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const ref = useRef(); // Reference for the list element
    const headerRef = useRef(); // Reference for the header container (Team Members header and first column header)
    const columnHeaderRef = useRef();
    const parentRef = useRef(); // Reference for the parent div (to set maxHeight and handle overflow)
    // In your Members component, add this state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const addButtonRef = useRef(null);

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
        updateHeight(); // Initial height calculation
        window.addEventListener('resize', updateHeight); // Recalculate on resize

        return () => {
            window.removeEventListener('resize', updateHeight); // Cleanup on unmount
        };
    }, [height]);

    return (
        <>
          {/* Members List */}
          <div ref={parentRef} className="h-full mt-1 rounded-lg">
            {/* Header Section */}
            <div ref={headerRef} className="flex flex-row w-full justify-between">
              <div>
                <h2 className="text-xl 2xl:text-2xl font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Project Sectors
                </h2>
              </div>
              <div className="flex flex-row items-center space-x-2">
                {/* Search Bar */}
                <div className="relative">
                    <input
                    type="text"
                    placeholder="Search sectors..."
                    className="w-64 p-2 rounded-lg bg-[#1F1F1F] text-white text-sm placeholder-gray-400 border border-[#2E2E2E] focus:outline-none focus:ring-1 focus:ring-[#91C8FF] h-10" // Ensure consistent height
                    />
                    <span className="absolute top-2 right-3 text-gray-400">
                    <FiSearch />
                    </span>
                </div>

                <div className="relative"> {/* Add this wrapper div */}
                    <button 
                        ref={addButtonRef}
                        onClick={() => setIsDropdownOpen(true)}
                        className="flex flex-row items-center bg-[#6f99d8] hover:bg-[#91C8FF] rounded-lg text-sm text-white p-2 px-4 h-10"
                    >
                        <FiPlus /> Create Sector
                    </button>
                    </div>
                </div>
            </div>
    
            {/* Table Headers */}
            <div ref={columnHeaderRef} className="grid grid-cols-4 gap-4 text-sm pl-2 font-light text-gray-500 border-b border-gray-700 py-2">
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
            </div>
          </div>
        </>
      );
}