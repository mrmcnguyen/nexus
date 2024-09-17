'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

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
    name: "1-3-5 Method",
    description: "Focus on 1 big task, 3 medium tasks, and 5 small tasks each day.",
    link: "/nexusME/1-3-5",
  },
  {
    name: "Kanban",
    description: "Visualize tasks using a board and limit work in progress.",
    link: "/nexusME/kanban",
  },
  {
    name: "To-Do List",
    description: "Create a normal daily To-Do list to breeze through your tasks.",
    link: "/nexusME/to-do-list",
  },
  {
    name: "Take notes",
    description: "Map out your thoughts and ideas.",
    link: "/nexusME/mindMap",
  },
];

export default function Navbar({ page }) {
  return (
    <nav className={`pt-1 pb-1 h-1/5 flex flex-row items-center border-b border-[#c2c8d0] ${dmSans.className} ${page === '/nexusME/pomodoro' ? 'bg-red-100' : ''}`}>
      {/* Logo */}
      <Link href="/dashboard">
        <Image
          src="/nexusLogo.png"
          alt="Logo"
          width={130}
          height={60}
          priority
        />
      </Link>

      {/* Navigation Links */}
      <div className="p-2 flex-grow flex items-center justify-left space-x-4">
        {frameworks.map((framework) => (
          <Link
            key={framework.name}
            href={framework.link}
            className={`text-gray-500 font-semibold hover:text-blue-400 ${
              page === framework.link ? 'text-blue-400' : ''
            }`}
          >
            {framework.name}
          </Link>
        ))}
      </div>

      {/* Button on the right side */}
      <div className=" flex flex-row ml-auto pr-4">
      <button className="px-4 py-2 mr-2 text-gray-600 transition duration-200 border border-[#c2c8d0] align-middle font-semibold rounded-lg hover:bg-gray-300">
About 
        </button>
        <button className="flex flex-row px-4 py-2 align-middle items-center transition duration-200 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-300">
Nexus TEAMS<Image
    src="/newTab.svg"
    className="ml-2 filter invert"  
    width={14}
    height={14}
    priority
  />
        </button>
      </div>
    </nav>
  );
}
