'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { createClient } from "../../../supabase/client";
import { getUserFullName } from "../../lib/db/userQueries";
import { FiArrowRight, FiClock, FiTarget, FiCheckSquare, FiEye, FiTrendingUp, FiCalendar, FiZap } from "react-icons/fi";
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from "../../../contexts/NotificationContext";
import { getKanbanTasks } from "../../lib/db/queries";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [motivationalQuote, setMotivationalQuote] = useState('');
    const router = useRouter();
    const { dashboardNotifs, removeDashboardNotification, markAsRead, showNotificationModal } = useNotifications();

    const supabase = createClient();

    // Motivational quotes array
    const quotes = [
        "The way to get started is to quit talking and begin doing. - Walt Disney",
        "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "It is during our darkest moments that we must focus to see the light. - Aristotle",
        "The only way to do great work is to love what you do. - Steve Jobs"
    ];

    // Feature cards data
    const features = [
        {
            id: 'eisenhower',
            title: 'Eisenhower Matrix',
            description: 'Prioritize tasks by urgency and importance',
            icon: FiTarget,
            href: '/nexusME/eisenhower-matrix',
            color: 'from-blue-500/20 to-blue-600/20',
            borderColor: 'border-blue-500/30',
            iconColor: 'text-blue-400'
        },
        {
            id: 'pomodoro',
            title: 'Pomodoro Timer',
            description: 'Focus with 25-minute work sessions',
            icon: FiClock,
            href: '/nexusME/pomodoro',
            color: 'from-red-500/20 to-red-600/20',
            borderColor: 'border-red-500/30',
            iconColor: 'text-red-400'
        },
        {
            id: 'kanban',
            title: 'Kanban Board',
            description: 'Visualize and manage your workflow',
            icon: FiCheckSquare,
            href: '/nexusME/kanban',
            color: 'from-green-500/20 to-green-600/20',
            borderColor: 'border-green-500/30',
            iconColor: 'text-green-400'
        },
        {
            id: 'vision-board',
            title: 'Vision Board',
            description: 'Visualize your goals and aspirations',
            icon: FiEye,
            href: '/nexusME/vision-board',
            color: 'from-purple-500/20 to-purple-600/20',
            borderColor: 'border-purple-500/30',
            iconColor: 'text-purple-400'
        },
        {
            id: 'my-week',
            title: 'My Week',
            description: 'Plan and organize your weekly schedule',
            icon: FiCalendar,
            href: '/nexusME/my-week',
            color: 'from-orange-500/20 to-orange-600/20',
            borderColor: 'border-orange-500/30',
            iconColor: 'text-orange-400'
        },
        {
            id: 'to-do',
            title: 'To-Do List',
            description: 'Simple task management and tracking',
            icon: FiZap,
            href: '/nexusME/to-do-list',
            color: 'from-yellow-500/20 to-yellow-600/20',
            borderColor: 'border-yellow-500/30',
            iconColor: 'text-yellow-400'
        }
    ];


    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
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
                setUser(null);
                router.push('/signIn');
            }
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const date = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            setCurrentTime(time);
            setCurrentDate(date);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Set a random motivational quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setMotivationalQuote(randomQuote);
    }, []);

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
            <div className="flex flex-col min-h-screen items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-gray-400">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Image src="/nexusNoBorder.png" width={100} height={15} alt="Nexus Logo" />
                    <div className="flex items-center space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white 
                                     border border-gray-700/50 rounded-lg transition-all duration-200"
                            onClick={handleLogout}
                        >
                            Account
                        </motion.button>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 
                                     border border-blue-500/30 rounded-lg transition-all duration-200 flex items-center space-x-2"
                            href='https://github.com/mrmcnguyen/nexus'
                            target='_blank'
                        >
                            <Image src="/git.svg" className="w-4 h-4" alt="GitHub" width={16} height={16} />
                            <span>Docs</span>
                        </motion.a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-6xl md:text-7xl font-light text-white mb-2">
                            {currentTime}
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-gray-300 font-light mb-4">
                            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {userName}
                        </h2>
                        <p className="text-lg text-gray-400 mb-6">{currentDate}</p>
                        
                        {/* Motivational Quote */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="max-w-3xl mx-auto"
                        >
                            <blockquote className="text-lg text-gray-300 italic border-l-4 border-blue-500/30 pl-6 py-4 bg-gray-900/30 rounded-r-lg">
                                "{motivationalQuote}"
                            </blockquote>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Feature Cards Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link href={feature.href}>
                                    <div className={`group relative p-6 bg-neutral-900/50 
                                                   border border-gray-700/50 rounded-md 
                                                   hover:shadow-2xl hover:shadow-black/20 hover:border-gray-600/50
                                                   transition-all duration-300 cursor-pointer
                                                   backdrop-blur-sm`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-gray-800/50 ${feature.iconColor}`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white 
                                                                 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                        <h3 className="text-xl font-semibold tracking-tight text-white mb-2 group-hover:text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm tracking-tight group-hover:text-gray-300 transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                        
                                        {/* Subtle glow effect on hover */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Quick Stats & Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Notifications */}
                    <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white">Notifications</h3>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="space-y-3">
                            {dashboardNotifs.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No new notifications</p>
                            ) : (
                                dashboardNotifs.slice(0, 4).map((notif) => (
                                    <motion.div
                                        key={notif.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-800/50 
                                                 rounded-lg cursor-pointer transition-all duration-200"
                                        onClick={() => handleNotificationClick(notif)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${notif.read ? 'bg-gray-500' : 'bg-blue-500'}`}></div>
                                            <span className={`text-sm ${notif.read ? 'text-gray-400' : 'text-gray-300'}`}>
                                                {notif.message}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                        </span>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-white mb-4">Today's Focus</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-300">Tasks Completed</span>
                                </div>
                                <span className="text-2xl font-bold text-green-400">0</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-300">In Progress</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-400">0</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span className="text-gray-300">Pending</span>
                                </div>
                                <span className="text-2xl font-bold text-yellow-400">0</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
