import { getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Image from "next/image";

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
        <main className="flex flex-col min-h-screen items-center justify-center p-10 bg-custom-gradient">
            <Image
    src="/nexusLogo.png"
    width={200}
    height={20}
    priority
  />
            <div className="flex flex-col items-center justfiy-center">
            <div className="w-full p-10 text-center h-full">
                <h1 className="text-6xl font-light">Welcome, Kevin</h1><br />
                <h2 className="text-xl">{formatDate()}</h2>
            </div>
            <div className="w-full p-10 text-center">
                <div className="grid grid-cols-2 gap-4">
                <button className="p-8 border text-white rounded-xl">Nexus ME</button>
                <button className="p-8 border text-white rounded-xl">Nexus TEAM</button>
                    <button className="p-8 border text-white bg-red-300 flex flex-row rounded-xl">
            <Image
              src="/tomato-svgrepo-com.svg"
              className="mr-4"
              width={24}
              height={24}
              priority
            /> Pomodoro Timer</button>
                    <button className="p-8 border text-white bg-emerald-400 flex flex-row justfiy-center rounded-xl">
                    <Image
              src="/idea.svg"
              className="mr-4 "
              width={24}
              height={24}
              priority
            />    
            Map your thoughts</button>
                    <button className="p-8 border bg-[#ffb098] text-white flex flex-row rounded-xl">
                    <Image
              src="/plan-svgrepo-com.svg"
              className="mr-4"
              width={24}
              height={24}
              priority
            />    
                        Plan your day</button>
                    <button className="p-8 border flex flex-row bg-sky-400 text-white rounded-xl">
                    <Image
              src="/meeting-meet-svgrepo-com.svg"
              className="mr-4"
              width={24}
              height={24}
              priority
            /> 
            Plan a meeting</button>
                </div>
            </div>
            </div>
        </main>
    );
}
