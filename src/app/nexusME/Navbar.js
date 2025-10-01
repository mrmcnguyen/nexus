'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { DM_Sans } from 'next/font/google';
import { createClient } from "../../../supabase/client";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';


const dmSans = DM_Sans({ subsets: ['latin'] });
const frameworks = [
  {
    name: 'Eisenhower Matrix',
    description: 'Prioritize tasks based on urgency and importance.',
    link: '/nexusME/eisenhower-matrix',
  },
  {
    name: 'Pomodoro',
    description: 'Work in short, focused intervals, followed by brief breaks to enhance focus and productivity.',
    link: '/nexusME/pomodoro',
  },
  {
    name: 'Kanban',
    description: 'Visualize tasks using a board and limit work in progress.',
    link: '/nexusME/kanban',
  },
  {
    name: 'My Week',
    link: '/nexusME/my-week',
    description: 'Visualize your goals and dreams.',
  },
  {
    name: 'Vision Board',
    description: 'Visualize your goals and dreams.',
    link: '/nexusME/vision-board',
  },
];

export default function Navbar({ page }) {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const supabase = createClient();

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        setUser(null);
        router.push('/signIn');
    } else {
        console.error("Logout error:", error);
    }
  }, [router, supabase.auth]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 flex flex-row items-center border-b border-[#2e2e2e] bg-white ${dmSans.className} ${page === '/nexusME/pomodoro' ? 'bg-red-100' : ''
        }`}
      style={{ height: '50px', backgroundColor: 'black' }} // Set height for the navbar
    >
      {/* Logo */}
      <Link href="/dashboard" className='h-full flex flex-row items-center bg-gradient-to-br from-[#1f1f1f] border-r border-r-[#2e2e2e]'>
        <Image
          src="/nexusLogo.png"
          alt="Logo"
          width={100}
          height={30}
          priority
        />
      </Link>

      {/* Navigation Links - Container with full height */}
      <div className="ml-2 px-2 flex-grow flex items-center text-light justify-left space-x-4 h-full">
        {frameworks.map((framework) => {
          const isVisionBoard = framework.name === 'Vision Board';
          const isActive = pathname === framework.link;
          
          return (
            <Link
              key={framework.name}
              href={framework.link}
              className={`text-sm font-medium relative transition-all duration-300 ${
                isVisionBoard
                  ? `px-2 py-0.5 rounded-lg ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-500/25'
                        : 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 text-gray-300 border border-slate-600/50 hover:from-cyan-500/10 hover:to-purple-500/10 hover:text-cyan-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/20'
                    }`
                  : `h-full flex items-center hover:text-[#91C8FF] ${
                      isActive
                        ? 'text-[#91C8FF] border-b-2 border-[#91C8FF]'
                        : 'text-gray-400'
                    }`
              }`}
            >
              {isVisionBoard && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                  <span>{framework.name}</span>
                </div>
              )}
              {!isVisionBoard && framework.name}
            </Link>
          );
        })}
      </div>

      {/* Right-side Buttons */}
      <div className="flex flex-row ml-auto pr-4 items-center space-x-4">
        <a className="flex flex-row bg-gradient-to-br from-black items-center px-4 py-1 text-gray-300 transition duration-200 border border-[#454545] align-middle text-sm text-light rounded-lg hover:bg-[#2F2F2F]"
          href='https://github.com/mrmcnguyen/nexus'
          target='_blank'
        >
          <Image
            src="/git.svg"
            className="mr-2 filter invert"
            alt="GitHub"
            width={14}
            height={14}
            priority
          />
          Docs
        </a>
        {/* <Link className="flex flex-row px-4 py-1 align-middle items-center transition duration-200 bg-[#6f99da] text-sm text-white text-light rounded-lg hover:bg-[#91c8ff]"
          href="/nexusTEAMS/allTeams"
          target='_blank?'
        >
          Nexus TEAMS
          <Image
            src="/newTab.svg"
            className="ml-2 filter invert"
            alt="Teams"
            width={14}
            height={14}
            priority
          />
        </Link> */}

        {/* Account Icon */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 hover:bg-gray-400 focus:outline-none"
          >
            <Image
              src="/account.svg"
              alt="Account"
              width={100}
              height={100}
              className="rounded-full filter invert"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}