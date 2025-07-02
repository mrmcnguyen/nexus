"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../../supabase/client";
import {
    getEpics,
    addEpic,
    updateEpic,
    deleteEpic,
    getEpicTasks
} from "../../../../lib/db/epicQueries";

export default function EpicManager() {
    const [epics, setEpics] = useState([]);
    const [userID, setUserID] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEpic, setEditingEpic] = useState(null);
    const [epicName, setEpicName] = useState("");
    const [epicDescription, setEpicDescription] = useState("");
    const [selectedEpic, setSelectedEpic] = useState(null);
    const [epicTasks, setEpicTasks] = useState([]);
    const [epicStatusCounts, setEpicStatusCounts] = useState({});

    const supabase = createClient();
    const router = useRouter();

    // Epic color generation
    const epicColors = [
        'bg-purple-600 text-purple-100',
        'bg-blue-600 text-blue-100',
        'bg-green-600 text-green-100',
        'bg-yellow-600 text-yellow-100',
        'bg-red-600 text-red-100',
        'bg-indigo-600 text-indigo-100',
        'bg-pink-600 text-pink-100',
        'bg-teal-600 text-teal-100',
        'bg-orange-600 text-orange-100',
        'bg-cyan-600 text-cyan-100',
        'bg-emerald-600 text-emerald-100',
        'bg-violet-600 text-violet-100'
    ];

    const getEpicColor = (epicId) => {
        if (!epicId) return epicColors[0];
        // Generate a consistent color based on epic ID
        const hash = epicId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return epicColors[Math.abs(hash) % epicColors.length];
    };

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

    // Fetch epics and their task status breakdown
    useEffect(() => {
        const fetchEpicsAndStatus = async () => {
            if (userID) {
                const result = await getEpics(userID);
                if (result) {
                    setEpics(result);
                    // For each epic, fetch its tasks and compute status breakdown
                    const statusCounts = {};
                    await Promise.all(result.map(async (epic) => {
                        const tasks = await getEpicTasks(epic.epic_id);
                        const counts = { Done: 0, 'In Progress': 0, 'To Do': 0, Backlog: 0 };
                        tasks.forEach(task => {
                            if (counts[task.status] !== undefined) counts[task.status]++;
                        });
                        statusCounts[epic.epic_id] = counts;
                    }));
                    setEpicStatusCounts(statusCounts);
                }
                setIsLoading(false);
            }
        };
        fetchEpicsAndStatus();
    }, [userID]);

    const handleAddEpic = async (e) => {
        e.preventDefault();
        if (epicName.trim()) {
            const result = await addEpic(userID, epicName, epicDescription);
            if (result.success) {
                setEpics([...epics, result.data]);
                setEpicName("");
                setEpicDescription("");
                setIsModalOpen(false);
            }
        }
    };

    const handleEditEpic = async (e) => {
        e.preventDefault();
        if (epicName.trim() && editingEpic) {
            const result = await updateEpic(editingEpic.epic_id, epicName, epicDescription);
            if (result.success) {
                setEpics(epics.map(epic =>
                    epic.epic_id === editingEpic.epic_id
                        ? { ...epic, title: epicName, description: epicDescription }
                        : epic
                ));
                setEpicName("");
                setEpicDescription("");
                setEditingEpic(null);
                setIsModalOpen(false);
            }
        }
    };

    const handleDeleteEpic = async (epicId) => {
        const result = await deleteEpic(epicId);
        if (result.success) {
            setEpics(epics.filter(epic => epic.epic_id !== epicId));
        }
    };

    const openEditModal = (epic) => {
        setEditingEpic(epic);
        setEpicName(epic.title);
        setEpicDescription(epic.description || "");
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingEpic(null);
        setEpicName("");
        setEpicDescription("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEpic(null);
        setEpicName("");
        setEpicDescription("");
    };

    const viewEpicDetails = async (epic) => {
        setSelectedEpic(epic);
        const tasks = await getEpicTasks(epic.epic_id);
        console.log(tasks);
        setEpicTasks(tasks || []);
    };

    const navigateToKanban = () => {
        router.push('/nexusME/kanban');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#171717]">
                <div className="text-gray-300">Loading epics...</div>
            </div>
        );
    }

    return (
        <div className="p-8 pt-4 min-h-screen bg-[#171717]">
            <div className="flex flex-row justify-between items-center mb-6">
                <div className="flex flex-row items-center">
                    <h1 className="text-5xl text-gray-300 font-black text-left lg:text-4xl md:text-3xl 2xl:text-4xl">
                        Epic Management
                    </h1>
                    <span className="flex flex-row items-center m-4 border border-[#2F2F2F] bg-gradient-to-br from-[#1f1f1f] text-gray-400 text-xs rounded-2xl px-2">
                        <Image
                            src="/epic.svg"
                            style={{ filter: 'invert(1)' }}
                            width={14}
                            className="mr-1 mt-1 mb-1"
                            height={14}
                            alt="epic"
                            priority
                        />
                        {epics.length} Epics
                    </span>
                </div>
                <div className="flex flex-row space-x-4">
                    <button
                        onClick={navigateToKanban}
                        className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]"
                    >
                        <Image
                            src="/todo.svg"
                            className="mr-2"
                            width={14}
                            alt="kanban"
                            height={14}
                            priority
                        />
                        Back to Kanban
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]"
                    >
                        <Image
                            src="/plus.svg"
                            style={{ filter: 'invert(1)' }}
                            className="mr-2"
                            width={14}
                            alt="add"
                            height={14}
                            priority
                        />
                        Add Epic
                    </button>
                </div>
            </div>

            {/* Epics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {epics.map((epic, idx) => (
                    <div
                        key={epic.epic_id || idx}
                        className="relative bg-[#18181b] border border-[#333] rounded-xl shadow-lg p-6 flex flex-col mb-6"
                    >
                        <div className="flex flex-row items-center mb-2">
                            <h3 className="text-lg font-bold text-gray-100 flex-1">{epic.title}</h3>
                        </div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                                <span className={`${getEpicColor(epic.epic_id)} px-2 py-1 rounded-full text-xs`}>

                                </span>
                            </div>
                        </div>

                        {epic.description && (
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                {epic.description}
                            </p>
                        )}

                        {/* Status breakdown bar */}
                        <div className="mb-3">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-xs text-gray-400 ml-auto">{(epicStatusCounts[epic.epic_id]?.Done || 0)}/{Object.values(epicStatusCounts[epic.epic_id] || {}).reduce((a, b) => a + b, 0) || 0} Done</span>
                            </div>
                            <div className="w-full h-3 bg-[#232323] rounded-full flex overflow-hidden">
                                <div className="h-3 bg-green-600" style={{ width: `${((epicStatusCounts[epic.epic_id]?.Done || 0) / ((Object.values(epicStatusCounts[epic.epic_id] || {}).reduce((a, b) => a + b, 0)) || 1)) * 100}%` }}></div>
                                <div className="h-3 bg-blue-600" style={{ width: `${((epicStatusCounts[epic.epic_id]?.['In Progress'] || 0) / ((Object.values(epicStatusCounts[epic.epic_id] || {}).reduce((a, b) => a + b, 0)) || 1)) * 100}%` }}></div>
                                <div className="h-3 bg-yellow-500" style={{ width: `${((epicStatusCounts[epic.epic_id]?.['To Do'] || 0) / ((Object.values(epicStatusCounts[epic.epic_id] || {}).reduce((a, b) => a + b, 0)) || 1)) * 100}%` }}></div>
                                <div className="h-3 bg-gray-600" style={{ width: `${((epicStatusCounts[epic.epic_id]?.Backlog || 0) / ((Object.values(epicStatusCounts[epic.epic_id] || {}).reduce((a, b) => a + b, 0)) || 1)) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs">
                                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span>Done: {epicStatusCounts[epic.epic_id]?.Done || 0}</span>
                                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span>In Progress: {epicStatusCounts[epic.epic_id]?.['In Progress'] || 0}</span>
                                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>To Do: {epicStatusCounts[epic.epic_id]?.['To Do'] || 0}</span>
                                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-600 mr-1"></span>Backlog: {epicStatusCounts[epic.epic_id]?.Backlog || 0}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                                Created: {new Date(epic.created_at).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => viewEpicDetails(epic)}
                                className="text-blue-400 hover:text-blue-300 text-sm transition duration-200"
                            >
                                View Tasks
                            </button>
                        </div>

                        {/* Action Buttons (AI Summary, Edit, Delete) */}
                        <div className="flex flex-row justify-between items-center mt-4">
                            <button
                                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                title="AI Summary (coming soon)"
                            >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                    AI Summary
                                </span>
                            </button>
                            <div className="flex flex-row space-x-2">
                                <button
                                    className="px-2 py-1 text-xs text-blue-400 hover:text-blue-200 rounded hover:bg-[#232323] transition"
                                    onClick={() => handleEditEpic(epic)}
                                    title="Edit Epic"
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 text-xs text-red-400 hover:text-red-200 rounded hover:bg-[#232323] transition"
                                    onClick={() => handleDeleteEpic(epic.epic_id)}
                                    title="Delete Epic"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {epics.length === 0 && (
                <div className="text-center py-12">
                    <Image
                        src="/epic.svg"
                        width={64}
                        height={64}
                        alt="epic"
                        className="mx-auto mb-4 opacity-50"
                        style={{ filter: 'invert(1)' }}
                    />
                    <h3 className="text-xl text-gray-400 mb-2">No epics yet</h3>
                    <p className="text-gray-500 mb-4">Create your first epic to organize your tasks</p>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                        Create Epic
                    </button>
                </div>
            )}

            {/* Add/Edit Epic Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1f1f1f] border border-[#2F2F2F] rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">
                            {editingEpic ? 'Edit Epic' : 'Add New Epic'}
                        </h2>

                        <form onSubmit={editingEpic ? handleEditEpic : handleAddEpic}>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Epic Name
                                </label>
                                <input
                                    type="text"
                                    value={epicName}
                                    onChange={(e) => setEpicName(e.target.value)}
                                    className="w-full p-3 bg-[#292929] border border-[#454545] rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter epic name..."
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={epicDescription}
                                    onChange={(e) => setEpicDescription(e.target.value)}
                                    className="w-full p-3 bg-[#292929] border border-[#454545] rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter epic description..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-400 hover:text-gray-200 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                                >
                                    {editingEpic ? 'Update Epic' : 'Create Epic'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Epic Details Modal */}
            {selectedEpic && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1f1f1f] border border-[#2F2F2F] rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold text-gray-200">
                                {selectedEpic.title}
                            </h2>
                            <button
                                onClick={() => setSelectedEpic(null)}
                                className="text-gray-400 hover:text-gray-200 transition duration-200"
                            >
                                ✕
                            </button>
                        </div>

                        {selectedEpic.description && (
                            <p className="text-gray-400 mb-4">
                                {selectedEpic.description}
                            </p>
                        )}

                        <h3 className="text-lg font-medium text-gray-200 mb-3">
                            Tasks in this Epic ({epicTasks.length})
                        </h3>

                        {epicTasks.length > 0 ? (
                            <div className="space-y-2">
                                {epicTasks.map((task) => (
                                    <div
                                        key={task.task_id}
                                        className="bg-[#292929] border border-[#454545] rounded-lg p-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-gray-200 font-medium">
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'Done' ? 'bg-green-600 text-green-100' :
                                                task.status === 'In Progress' ? 'bg-blue-600 text-blue-100' :
                                                    task.status === 'To Do' ? 'bg-yellow-600 text-yellow-100' :
                                                        'bg-gray-600 text-gray-100'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                No tasks assigned to this epic yet.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 