import { getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans } from 'next/font/google';

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
                    <h1 className="text-6xl font-light text-white">Welcome, Kevin</h1><br />
                    <h2 className="text-xl text-white">{formatDate()}</h2>
                </div>
                <div className="w-full p-10 text-center">
                    <div className="grid grid-cols-2 gap-4">
                        <Link className="p-8 bg-blue-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-600" href={'./nexusME/chooseAFramework/'}>
                            Nexus ME
                        </Link>
                        <button className="p-8 bg-green-600 text-white rounded-xl hover:shadow-2xl hover:shadow-green-600">
                            Nexus TEAM
                        </button>
                        <button className="p-8 text-white bg-red-300 flex flex-row rounded-xl hover:shadow-2xl hover:shadow-red-300">
                            <Image
                                src="/tomato-svgrepo-com.svg"
                                className="mr-4"
                                width={24}
                                height={24}
                                priority
                            />
                            Pomodoro Timer
                        </button>
                        <button className="p-8 text-white bg-emerald-400 flex flex-row justify-center rounded-xl hover:shadow-2xl hover:shadow-emerald-400">
                            <Image
                                src="/idea.svg"
                                className="mr-4"
                                width={24}
                                height={24}
                                priority
                            />
                            Map your thoughts
                        </button>
                        <button className="p-8 bg-[#ffb098] text-white flex flex-row rounded-xl hover:shadow-2xl hover:shadow-[#ffb098]">
                            <Image
                                src="/plan-svgrepo-com.svg"
                                className="mr-4"
                                width={24}
                                height={24}
                                priority
                            />
                            Plan your day
                        </button>
                        <button className="p-8 flex flex-row bg-sky-400 text-white rounded-xl hover:shadow-2xl hover:shadow-sky-400">
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
        </main>
        </body>
    );
}
