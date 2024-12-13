'use client'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Beam from '../Beam';
import { motion } from "framer-motion";
import { DM_Sans } from 'next/font/google';
import { useState, useEffect } from 'react';
import { createClient } from "../../../supabase/client";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function Dashboard() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState('');

    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true); // Start loading
            console.log(supabase);
            const { data, error } = await supabase.auth.getUser();
            console.log("Fetched data:", data);
    
            if (data?.user) {
                setUser(data.user); // Set the user data if available
            } else {
                console.error("User not found:", error);
                setUser(null); // Ensure user state is explicitly null if not found
                router.push('/signIn'); // Redirect to sign-in page
            }
    
            setLoading(false); // Stop loading
        };
    
        fetchUser();
    }, [router]); // Add router as a dependency

    useEffect(() => {
        const updateTime = () => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setCurrentTime(time);
        };
        updateTime(); // Set initial time
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

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

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error);
        } else {
            setUser(null);
            router.push('/signIn'); // Redirect to the sign-in page
        }
    };

    if (loading) {
        return <div className="flex flex-col min-h-screen items-center justify-center p-5 bg-fixed bg-cover bg-center overflow-hidden"
        >Loading...</div>;  // Show loading state until user data is fetched
    }

    return (
        <main
            className="flex flex-col min-h-screen items-center justify-center p-5 bg-fixed bg-cover bg-center overflow-hidden"
        >
            {/* Logout Button */}
            <button
                className="absolute top-5 right-5 px-4 py-2 text-white rounded-lg shadow transition"
                onClick={handleLogout}
            >
                Log Out
            </button>

            <Image
                src="/nexusLogo.png"
                width={200}
                height={20}
                alt="Nexus Logo"
                priority
            />
            <div className="flex flex-col items-center justify-center">
                <div className="w-full p-10 text-center h-full pt-5">
                    <h1 className="lg:text-7xl md:text-6xl 2xl:text-8xl fond-bold text-white mb-4">{currentTime}</h1>
                    <h2 className="lg:text-3xl md:text-2xl 2xl:text-4xl text-white">{formatDate()}</h2>
                </div>
                <div className="max-w-full p-10 text-center pt-0">
                    <div className="max-w-full grid grid-cols-2 gap-4">
                    <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0 }}
          variants={{
            hidden: { opacity: 0, y: 0, scale: 1, rotateX: 45 },
            visible: {
              opacity: 1,
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
              rotateX: 0,
            },
          }}
          className="p-6 rounded-md bg-[#1f1f1f] relative overflow-hidden flex items-center justify-center"
        >
            <Link href={'./nexusME/chooseAFramework/'}>
                            <div className="flex flex-row mb-6 justify-center">
                                <Image
                                    src="/individual.svg"
                                    className="mr-4 filter invert"
                                    width={24}
                                    alt="t"
                                    height={24}
                                    priority
                                />
                                <h2 className="text-2xl font-semibold text-gray-200">Nexus ME</h2>
                            </div>
                            <p className="text-gray-300">Everything you need for your individual productivity.</p>
                        </Link>

          {/* Two Beams that run on top of the container */}
          <Beam className="top-0" />
          <Beam className="top-0" />

          {/* A bottom gradient that looks cute */}
          <div className="z-0 ">
            <div className="absolute bottom-0 left-4 mt-[2px] flex h-8 items-end overflow-hidden">
              <div className="flex -mb-px h-[2px] w-80 -scale-x-100">
                <div className="w-full flex-none blur-sm [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
                <div className="-ml-[100%] w-full flex-none blur-[1px] [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0 }}
          variants={{
            hidden: { opacity: 0, y: 0, scale: 1, rotateX: 45 },
            visible: {
              opacity: 1,
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
              rotateX: 0,
            },
          }}
          className="p-6 rounded-md bg-[#1f1f1f] relative overflow-hidden flex items-center justify-center"
        >
            <Link href={'./nexusME/chooseAFramework/'}>
                            <div className="flex flex-row mb-6 justify-center">
                                <Image
                                    src="/team.svg"
                                    className="mr-4 filter invert"
                                    width={24}
                                    alt="t"
                                    height={24}
                                    priority
                                />
                                <h2 className="text-2xl font-semibold text-gray-200">Nexus TEAMS</h2>
                            </div>
                            <p className="text-gray-300">Meetings. Collaborations. It's all here.</p>
                        </Link>

          {/* Two Beams that run on top of the container */}
          <Beam className="top-0" delay={3} />
          <Beam className="top-0" deplay={5} />

          {/* A bottom gradient that looks cute */}
          <div className="z-0 ">
            <div className="absolute bottom-0 left-4 mt-[2px] flex h-8 items-end overflow-hidden">
              <div className="flex -mb-px h-[2px] w-80 -scale-x-100">
                <div className="w-full flex-none blur-sm [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
                <div className="-ml-[100%] w-full flex-none blur-[1px] [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
              </div>
            </div>
          </div>
        </motion.div>

                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-left text-white text-4xl m-4 ml-0 mt-14">Quick Shortcuts</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href={'./nexusME/pomodoro'} className="p-8 text-white transition duration-200 bg-[#1e293b] flex flex-row rounded-xl hover:shadow-lg hover:shadow-red-300">
                                <Image
                                    src="/tomato-svgrepo-com.svg"
                                    className="mr-4"
                                    width={24}
                                    height={24}
                                    alt="t"
                                    priority
                                />
                                Pomodoro Timer
                            </Link>
                            <button className="p-8 text-white bg-[#1e293b] transition duration-200 flex flex-row rounded-xl hover:shadow-2xl hover:shadow-emerald-300">
                                <Image
                                    src="/idea.svg"
                                    className="mr-4"
                                    width={24}
                                    height={24}
                                    alt="t"
                                    priority
                                />
                                Map your thoughts
                            </button>
                            <button className="p-8 bg-[#1e293b] text-white transition duration-200  flex flex-row rounded-xl hover:shadow-2xl hover:shadow-[#ffb098]">
                                <Image
                                    src="/plan-svgrepo-com.svg"
                                    className="mr-4"
                                    width={24}
                                    height={24}
                                    alt="t"
                                    priority
                                />
                                Plan out a project
                            </button>
                            <button className="p-8 flex flex-row bg-[#1e293b] transition duration-200 text-white rounded-xl hover:shadow-2xl hover:shadow-sky-400">
                                <Image
                                    src="/meeting-meet-svgrepo-com.svg"
                                    className="mr-4"
                                    width={24}
                                    height={24}
                                    alt="t"
                                    priority
                                />
                                Plan a meeting
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
