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
        description: "Work in short, focused intervals, followed by breaks.",
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
  
    return (
      <main className="bg-fixed bg-cover bg-center">
      <SelectionPane frameworks={frameworks}/>
      </main>
    );
  }
  