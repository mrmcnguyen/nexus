'use client'
import { getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans } from 'next/font/google';
import { useState, useEffect } from 'react';

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function Dashboard() {

    const name = getAuth().currentUser;
    // Function to format the date
    const formatDate = () => {
        const date = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const day = date.toLocaleDateString('en-US', { day: 'numeric' });
        const suffix = (day % 10 === 1 && day !== '11') ? 'st' :
                       (day % 10 === 2 && day !== '12') ? 'nd' :
                       (day % 10 === 3 && day !== '13') ? 'rd' : 'th';
        return date.toLocaleDateString('en-US', options).replace(day, `${day}${suffix}`);
    };

    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setCurrentTime(time);
        };
        updateTime(); // Set initial time
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);


    return (
        <body className={dmSans.className}>
        <main className="flex flex-col min-h-screen items-center justify-center p-10 bg-[#333]">
            <Image
                src="/nexusLogo.png"
                width={200}
                height={20}
                priority
            />
            <div className="flex flex-col items-center justify-center">
                <div className="w-full p-10 text-center h-full">
                    <h1 className="text-8xl fond-bold text-white mb-4">{currentTime}</h1>
                    <h2 className="text-4xl text-white">{formatDate()}</h2>
                </div>
                <div className="w-full p-10 text-center pt-0">
                <h1 className="text-6xl text-white">Welcome, Kevin</h1><br />
                    <div className="grid grid-cols-2 gap-4">
                        <Link className="p-6 bg-blue-500 rounded-lg transition duration-300 ease-in-out cursor-pointer hover:shadow-blue-200 transform hover:scale-105" href={'./nexusME/chooseAFramework/'}>
                            <div className="flex flex-row mb-6">
                            <Image
                                src="/individual.svg"
                                className="mr-4 filter invert"
                                width={24}
                                height={24}
                                priority
                            />
                            <h2 className="text-2xl font-semibold text-gray-200">Nexus ME</h2>
                            </div>
                            <p className="text-gray-200">Everything you need for your individual productivity.</p>
                        </Link>
                        <Link className="p-6 bg-sky-500 rounded-lg transition duration-300 ease-in-out cursor-pointer hover:shadow-blue-200 transform hover:scale-105" href={'./nexusME/chooseAFramework/'}>
                        <div className="flex flex-row mb-6">
                        <Image
                                src="/team.svg"
                                className="mr-4 filter invert"
                                width={24}
                                height={24}
                                priority
                            />
                            <h2 className="text-2xl font-semibold text-gray-200">Nexus TEAMS</h2>
                            </div>
                        <p className="text-left text-gray-200">Meetings. Collaboration. It's all here.</p>
                        </Link>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-left text-white text-4xl m-4 ml-0 mt-14">Quick Shortcuts</h2>
                        <div className="grid grid-cols-2 gap-4">
                    <Link href={'./nexusME/pomodoro'} className="p-8 text-white transition duration-200 bg-red-300 flex flex-row rounded-xl hover:shadow-lg hover:shadow-red-300">
                            <Image
                                src="/tomato-svgrepo-com.svg"
                                className="mr-4"
                                width={24}
                                height={24}
                                priority
                            />
                            Pomodoro Timer
                        </Link>
                        <button className="p-8 text-white bg-emerald-400 transition duration-200 flex flex-row rounded-xl hover:shadow-2xl hover:shadow-emerald-300">
                            <Image
                                src="/idea.svg"
                                className="mr-4"
                                width={24}
                                height={24}
                                priority
                            />
                            Map your thoughts
                        </button>
                        <button className="p-8 bg-[#ffb098] text-white transition duration-200  flex flex-row rounded-xl hover:shadow-2xl hover:shadow-[#ffb098]">
                            <Image
                                src="/plan-svgrepo-com.svg"
                                className="mr-4"
                                width={24}
                                height={24}
                                priority
                            />
                            Plan out a project
                        </button>
                        <button className="p-8 flex flex-row bg-sky-400 transition duration-200 text-white rounded-xl hover:shadow-2xl hover:shadow-sky-400">
                            <Image
                                src="/meeting-meet-svgrepo-com.svg"
                                className="mr-4"
                                width={24}
                                height={24}
                                priority
                            />
                            Plan a meeting
                        </button>
                        </div>
                        </div>
                </div>
            </div>
        </main>
        </body>
    );
}
