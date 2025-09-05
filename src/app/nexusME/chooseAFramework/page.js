'use client'
import SelectionPane from './SelectionPane';
import { DM_Sans } from 'next/font/google';
import {useRouter} from 'next/navigation';
import { useState, useEffect } from 'react';

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function ChooseFramework() {
    const frameworks = [
      {
        name: "Eisenhower Matrix",
        description: "Prioritize tasks based on urgency and importance.",
        link: "/nexusME/eisenhower-matrix",
      },
      {
        name: "The Pomodoro",
        description: "Work in short, focused intervals, followed by brief breaks to enhance focus and productivity.",
        link: "/nexusME/pomodoro",
      },
      {
        name: "Kanban",
        description: "Visualize tasks using a board and limit work in progress.",
        link: "/nexusME/kanban",
      },
      {
        name: "Mind Map",
        description: "Take notes of your thoughts and ideas.",
        link: "/nexusME/mindMap",
      },
    ];

  //   const [user, setUser] = useState(null);
  //   const router = useRouter();
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //         const { data, error } = await supabase.auth.getUser();
  //         console.log(data);
  //         if (!error){
  //             setUser(data.user);  // Set the user data
  //             setLoading(false);  // Stop loading after fetching
  //         } else{
  //             setUser("undefined");
  //         }
  //     }

  //     if (user === "undefined") {
  //         router.push('/signIn');  // Redirect only when loading is done and user is still null
  //     }

  //     fetchUser();
  // }, []);
  
    return (
      <main className="bg-fixed bg-cover bg-center">
      <SelectionPane frameworks={frameworks}/>
      </main>
    );
  }
  