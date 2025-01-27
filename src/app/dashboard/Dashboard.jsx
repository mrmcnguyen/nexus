'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Beam from '../Beam';
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { createClient } from "../../../supabase/client";
import { getUserFullName } from "../../lib/db/userQueries";
import { FiArrowRight, FiHelpCircle } from "react-icons/fi";
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from "../../../contexts/NotificationContext";
import { getProjectByID } from "../../lib/db/projectQueries";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [notifs, setNotifs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const router = useRouter();
    const { dashboardNotifs, removeDashboardNotification, markAsRead, showNotificationModal } = useNotifications();

    console.log(dashboardNotifs);

    const supabase = createClient();

    const buttonVariants = {
        initial: { scale: 1 },
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
        }
    };

    const [tasks, setTasks] = useState({
        personal: [
            { id: 1, title: 'Review PR #123', status: 'pending', due: '2024-12-25' },
            { id: 2, title: 'Update documentation', status: 'in-progress', due: '2024-12-26' },
            { id: 3, title: 'Review PR #123', status: 'pending', due: '2024-12-25' },
            { id: 4, title: 'Update documentation', status: 'in-progress', due: '2024-12-26' },
            { id: 5, title: 'Review PR #123', status: 'pending', due: '2024-12-25' },
            { id: 6, title: 'Update documentation', status: 'in-progress', due: '2024-12-26' },
            { id: 7, title: 'Update documentation', status: 'in-progress', due: '2024-12-26' },
            { id: 8, title: 'Review PR #123', status: 'pending', due: '2024-12-25' },
            { id: 9, title: 'Update documentation', status: 'in-progress', due: '2024-12-26' }
        ],
        team: [
            { id: 1, title: 'Sprint Planning', team: 'Frontend', status: 'upcoming', due: '2024-12-27' },
            { id: 2, title: 'Code Review', team: 'Backend', status: 'pending', due: '2024-12-28' },
            { id: 3, title: 'Sprint Planning', team: 'Frontend', status: 'upcoming', due: '2024-12-27' },
            { id: 4, title: 'Code Review', team: 'Backend', status: 'pending', due: '2024-12-28' },
            { id: 5, title: 'Sprint Planning', team: 'Frontend', status: 'upcoming', due: '2024-12-27' },
            { id: 6, title: 'Code Review', team: 'Backend', status: 'pending', due: '2024-12-28' },
            { id: 7, title: 'Sprint Planning', team: 'Frontend', status: 'upcoming', due: '2024-12-27' },
            { id: 8, title: 'Code Review', team: 'Backend', status: 'pending', due: '2024-12-28' },
            { id: 9, title: 'Sprint Planning', team: 'Frontend', status: 'upcoming', due: '2024-12-27' },
            { id: 10, title: 'Code Review', team: 'Backend', status: 'pending', due: '2024-12-28' },
            { id: 11, title: 'Sprint Planning', team: 'Frontend', status: 'upcoming', due: '2024-12-27' },
            { id: 12, title: 'Code Review', team: 'Backend', status: 'pending', due: '2024-12-28' }
        ]
    });


    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        console.log(notification);
        showNotificationModal(notification);
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUser(data.user);
                const res = await getUserFullName(data.user.id);
                if (res) setUserName(res[0].first_name);
            } else {
                console.error("User not found:", error);
                setUser(null);
                router.push('/signIn');
            }
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    useEffect(() => {
        const updateTime = () => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setCurrentTime(time);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchProjectData = async (project_id) => {
        try {
            // Fetch project data
            const projectData = await getProjectByID(project_id);
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

    const formatDate = () => {
        const date = new Date();
        const day = date.toLocaleDateString('en-US', { day: 'numeric' });
        const suffix = (day % 10 === 1 && day !== '11') ? 'st' :
                       (day % 10 === 2 && day !== '12') ? 'nd' :
                       (day % 10 === 3 && day !== '13') ? 'rd' : 'th';
        return date.toLocaleDateString('en-US', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        }).replace(day, `${day}${suffix}`);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            router.push('/signIn');
        } else {
            console.error("Logout error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center p-5 bg-fixed bg-cover bg-center overflow-hidden">
                Loading...
            </div>
        );
    }

    return (
        <main className="flex flex-col min-h-screen p-5 bg-fixed bg-cover bg-center overflow-hidden">
            <header className="w-full flex justify-between items-center pt-5">
                <Image src="/nexusNoBorder.png" width={160} height={40} alt="Nexus Logo" className="pl-10"/>
                <div className="flex flex-row space-x-2 mr-10">
                {/* <div className="flex flex-row items-center bg-[#1f1f1f] px-4 text-sm text-gray-400 rounded-2xl">Help <FiHelpCircle className="ml-1"/></div> */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    variants={buttonVariants}
                    whileHover="hover"
                    className="px-4 py-2 bg-gradient-to-br from-[#2f2f2f] text-gray-400 hover:text-white border border-gray-700 
                             rounded-lg transition-all duration-200 flex items-center space-x-2 
                             hover:border-gray-500 "
                    onClick={() => setIsModalOpen(true)}
                >
                    Account
                </motion.button>
                <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    variants={buttonVariants}
                    whileHover="hover"
                    className="px-4 py-2 text-gray-800 border border-gray-700 
                             rounded-lg transition-all duration-200 flex items-center space-x-2 
                             bg-[#91C8FF]"
                    href='https://github.com/mrmcnguyen/nexus'
                    target='_blank'
                >
                    <Image
                        src="/git.svg"
                        className="mr-2"
                        alt="GitHub"
                        width={14}
                        height={14}
                        priority
                              /> Docs
                </motion.a>
                </div>
            </header>

            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row w-full p-10 text-left justify-between h-full pt-5">
                    <div className="flex flex-col">
                        <h1 className="lg:text-7xl md:text-6xl 2xl:text-8xl font-semibold text-gray-400 mb-4">{currentTime}</h1>
                        <h2 className="text-gray-400 text-2xl md:text-4xl font-light mb-2">Welcome, {userName}</h2>
                        <h2 className="text-gray-400 text-2xl md:text-4xl font-semibold mb-2">{formatDate()}</h2>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="max-w-full flex flex-col space-y-4">
                            {/* Nexus ME */}
                            <Link href="./nexusME/chooseAFramework/">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileInView="visible"
                                whileHover={{ scale: 1.02 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3 }}
                                className="p-6 rounded-xl bg-gradient-to-br from-[#1f1f1f] relative overflow-hidden
                                          hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-800
                                          hover:border-blue-500/30"
                            >
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center">
                                            <Image src="/individual.svg" className="mr-4 filter invert" width={24} height={24} alt="Individual" priority />
                                            <h2 className="text-xl font-semibold text-gray-200">Nexus ME</h2>
                                        </div>
                                        <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                <Beam className="top-0" />
                            </motion.div>
                            </Link>

                            {/* Nexus TEAMS */}
                            <Link href="./nexusTEAMS/allTeams">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileInView="visible"
                                whileHover={{ scale: 1.02 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3 }}
                                className="p-6 rounded-xl bg-gradient-to-br from-[#1f1f1f] relative overflow-hidden
                                          hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-800
                                          hover:border-blue-500/30"
                            >
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center">
                                            <Image src="/team.svg" className="mr-4 filter invert" width={24} height={24} alt="Team" priority />
                                            <h2 className="text-xl font-semibold text-gray-200">Nexus TEAMS</h2>
                                        </div>
                                        <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                <Beam className="top-0" />
                            </motion.div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 w-full px-10">
                            {/* Notifications Section */}
                            <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#1f1f1f] bg-[#1f1f1f] rounded-xl p-6 border border-[#2e2e2e]"
                        >
                            <h3 className="text-gray-200 text-lg font-semibold mb-4">Notifications</h3>
                            <div className="space-y-3">
                                {dashboardNotifs.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No new notifications</p>
                                ) : (
                                    dashboardNotifs.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            className="flex items-center justify-between text-gray-300 text-sm hover:bg-gray-800/30 p-2 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => handleNotificationClick(notif)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${notif.read ? 'bg-gray-500' : 'bg-blue-500'}`}></div>
                                                <span className={notif.read ? 'text-gray-400' : 'text-gray-300'}>
                                                    {notif.message} from {notif.sender_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-gray-400 text-xs">
                                                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                                </span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeDashboardNotification(notif.id);
                                                    }}
                                                    className="text-gray-500 hover:text-gray-300"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                            {/* Personal Tasks */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#1f1f1f] rounded-xl p-6 border border-[#2e2e2e]"
                            >
                                <h3 className="text-gray-200 text-lg font-semibold mb-4">Personal Tasks</h3>
                                <div className="space-y-3">
                                    {tasks.personal.map(task => (
                                        <div key={task.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    task.status === 'pending' ? 'bg-yellow-500' :
                                                    task.status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'
                                                }`}></div>
                                                <span className="text-gray-300 text-sm">{task.title}</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">{new Date(task.due).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Team Tasks */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#1f1f1f] rounded-xl p-6 border border-[#2e2e2e] col-span-2"
                            >
                                <h3 className="text-gray-200 text-lg font-semibold mb-4">Team Tasks</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {tasks.team.map(task => (
                                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-gray-300 text-sm">{task.title}</span>
                                                <span className="text-gray-400 text-xs">{task.team}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className={`px-2 py-1 rounded-full text-xs ${
                                                    task.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    task.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300' : 
                                                    'bg-green-500/20 text-green-300'
                                                }`}>
                                                    {task.status}
                                                </div>
                                                <span className="text-gray-400 text-xs">{new Date(task.due).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
            </div>
        </main>
    );
}
