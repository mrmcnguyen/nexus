'use client'
import { useEffect, useState, useRef } from "react";
import { getProjectByID, getMembers } from "../../../../../lib/db/projectQueries";
import { FiPlus, FiSearch, FiStar, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import AddMemberDropdown from './addMemberModal';
import { usePresence, getUserStatus } from '../../../../../hooks/usePresence';

export default function Members({ id, userID }) {
    const [height, setHeight] = useState(null);
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const onlineUsers = usePresence();
    const ref = useRef();
    const headerRef = useRef();
    const columnHeaderRef = useRef();
    const parentRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const addButtonRef = useRef(null);

    const updateHeight = () => {
        if (ref.current && parentRef.current && headerRef.current && columnHeaderRef.current && height === null) {
            const totalHeight = parentRef.current.offsetHeight;
            const columnHeaderHeight = columnHeaderRef.current.offsetHeight;
            const headerHeight = headerRef.current.offsetHeight;
            const paddingTop = parseFloat(window.getComputedStyle(parentRef.current).paddingTop);
            const paddingBottom = parseFloat(window.getComputedStyle(parentRef.current).paddingBottom);

            setHeight(totalHeight - (headerHeight + columnHeaderHeight + paddingTop + paddingBottom));
        }
    };

    useEffect(() => {
        const getProject = async () => {
            try {
                const res = await getProjectByID(id);
                if (res) {
                    setProject(res);
                }
            } catch (error) {
                console.error("Failed to fetch project:", error);
            }
        };

        const getProjectMembers = async () => {
            try {
                const res = await getMembers(id);
                if (res) {
                    setMembers(res);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
            } finally {
                setIsLoading(false); // Stop loading after data is fetched
            }
        };

        getProject();
        getProjectMembers();
    }, [id]);

    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, [height]);

    return (
        <>
            <div ref={parentRef} className="h-full mt-1 rounded-lg">
                <div ref={headerRef} className="flex flex-row w-full justify-between">
                    <div>
                        <h2 className="text-xl 2xl:text-2xl font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                            Team Members
                        </h2>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="w-64 p-2 rounded-lg bg-[#1F1F1F] text-white text-sm placeholder-gray-400 border border-[#2E2E2E] focus:outline-none focus:ring-1 focus:ring-[#91C8FF] h-10"
                            />
                            <span className="absolute top-2 right-3 text-gray-400">
                                <FiSearch />
                            </span>
                        </div>
                        <div className="relative">
                            <button
                                ref={addButtonRef}
                                onClick={() => setIsDropdownOpen(true)}
                                className="flex flex-row items-center bg-[#6f99d8] hover:bg-[#91C8FF] rounded-lg text-sm text-white p-2 px-4 h-10"
                            >
                                <FiPlus /> Add Members
                            </button>
                            <AddMemberDropdown
                                isOpen={isDropdownOpen}
                                onClose={() => setIsDropdownOpen(false)}
                                projectId={id}
                                buttonRef={addButtonRef}
                                userID={userID}
                            />
                        </div>
                    </div>
                </div>

                <div ref={columnHeaderRef} className="grid grid-cols-5 gap-4 text-sm pl-2 font-light text-gray-500 border-b border-[#2f2f2f] py-2">
                    <div>NAME</div>
                    <div>EMAIL</div>
                    <div>SECTOR</div>
                    <div>ROLE</div>
                    <div>STATUS</div>
                </div>

                <div
                    ref={ref}
                    className="mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                    style={height !== null ? { maxHeight: `${height}px`, overflowY: 'auto' } : {}}
                >
                    {isLoading ? (
                        <div className="text-gray-500 text-center py-4">
                            Loading members...
                        </div>
                    ) : members.length > 0 ? (
                        members.map((member, index) => {
                            const status = getUserStatus(member.user_id, onlineUsers);
                            const initials = `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`.toUpperCase();
                        
                            return (
                                <div
                                    key={index}
                                    className="grid grid-cols-5 gap-4 items-center py-2 pl-2 rounded-lg hover:bg-[#292929]"
                                >
                                    <div className="text-sm text-gray-400 flex items-center">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 text-white font-bold mr-3">
                                            {initials}
                                        </div>
                                        {member.first_name} {member.last_name}
                                        {member.role === "MANAGER" && (
                                            <span className="ml-2 text-yellow-300">
                                                <FiStar />
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400">{member.email || "N/A"}</div>
                                    <div className="text-sm text-gray-400">{member.sector || "Not allocated"}</div>
                                    <div
                                    className={`text-sm rounded ${
                                        member.role === "MANAGER"
                                        ? "text-[#91c8ff]"
                                        : "text-gray-400"
                                    }`}
                                    >
                                    {member.role}
                                    </div>
                                    <div
                                        className={`text-xs font-semibold uppercase flex flex-row justify-between items-center`}
                                    >
                                        <div className={`flex flex-row items-center ${
                                            status === "Online"
                                                ? "text-emerald-300"
                                                : "text-red-700"
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${
                                            status === "Online" ? "bg-emerald-300" : "bg-red-700"
                                        }`}></span>
                                        {status}
                                        </div>
                                        <div>
                                        <div
                                        className="flex flex-row gap-4 mr-4"
                                        >
                                        <button className="rounded-full bg-gradient-to-br from-[#2f2f2f] p-2"><FiMessageCircle className="w-4 text-gray-400 h-4 rounded-full" /></button>
                                        <button className="rounded-full bg-gradient-to-br from-[#2f2f2f] p-2"><FiMoreHorizontal className="w-4 text-gray-400 h-4" /></button>
                                        </div>
                                        </div>
                                    </div>
                                </div>                        
                            );
                        })
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
