'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { motion } from "framer-motion";
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { createClient } from "../../../supabase/client";
import { getUserFullNameAction } from "../user-actions";
import { FiArrowRight, FiClock, FiTarget, FiCheckSquare, FiEye, FiTrendingUp, FiCalendar, FiZap } from "react-icons/fi";
import { useNotifications } from "../../../contexts/NotificationContext";

// Lazy load the chatbot component
const NexusChatbot = lazy(() => import("../../../components/NexusChatbot"));

// Memoized Feature Card Component
const FeatureCard = React.memo(({ feature, index }) => {
    const IconComponent = feature.icon;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
        >
            <Link href={feature.href}>
                <div className={`group relative p-4 bg-neutral-900/50 
                                border border-neutral-800 rounded-md 
                                hover:shadow-2xl hover:bg-neutral-800 hover:border-neutral-600/50
                                transition-all duration-300 cursor-pointer
                                backdrop-blur-sm`}>
                    <div>
                        <div className="flex items-center justify-between mb-4 pr-2">
                            <div className={`rounded-xl bg-gray-900/30 ${feature.iconColor}`}>
                                <IconComponent className="w-8 h-8" />
                            </div>
                            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white 
                                                   group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});

FeatureCard.displayName = 'FeatureCard';

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

    // Memoize static data to prevent re-creation on every render
    const quotes = useMemo(() => [
        "The way to get started is to quit talking and begin doing. - Walt Disney",
        "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "It is during our darkest moments that we must focus to see the light. - Aristotle",
        "The only way to do great work is to love what you do. - Steve Jobs"
    ], []);

    // Feature cards data - memoized to prevent re-creation
    const features = useMemo(() => [
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
    ], []);

    // Memoize event handlers to prevent re-creation
    const handleNotificationClick = useCallback((notification) => {
        markAsRead(notification.id);
        showNotificationModal(notification);
    }, [markAsRead, showNotificationModal]);

    const handleLogout = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            router.push('/signIn');
        } else {
            console.error("Logout error:", error);
        }
    }, [router, supabase.auth]);

    // Memoize expensive computations
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }, [currentTime]);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.auth.getUser();

                if (data?.user) {
                    setUser(data.user);
                    const res = await getUserFullNameAction(data.user.id);
                    console.log(res);
                    if (res) setUserName(res[0].first_name);
                } else {
                    setUser(null);
                    router.push('/signIn');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                router.push('/signIn');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router, supabase.auth]);

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
        // Set a random motivational quote only once
        if (quotes.length > 0) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setMotivationalQuote(randomQuote);
        }
    }, [quotes]);

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
                    transition={{ duration: 0.4 }}
                >
                    <div className="text-center">
                        <h1 className="text-6xl md:text-7xl font-light text-white mb-2">
                            {currentTime}
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-gray-300 font-light mb-4">
                            Good {greeting}, {userName}
                        </h2>
                        <p className="text-lg text-gray-400">{currentDate}</p>
                        
                        <NexusChatbot/>
                    </div>
                </motion.div>

                {/* Feature Cards Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </motion.div>
                    {/* Nexus Chatbot - Lazy Loaded */}
                    <Suspense fallback={
                        <div className="bg-neutral-900/50 border border-gray-700/50 rounded-md backdrop-blur-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-700/50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                                    <div>
                                        <div className="h-6 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        </div>
                    }>
                    </Suspense>
            </div>
        </main>
    );
}
