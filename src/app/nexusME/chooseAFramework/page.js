import SelectionPane from './SelectionPane'
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function ChooseFramework() {
    const frameworks = [
      {
        name: "Eisenhower Matrix",
        description: "Prioritize tasks based on urgency and importance.",
        link: "/eisenhower-matrix",
      },
      {
        name: "The Pomodoro",
        description: "Work in short, focused intervals, followed by brief breaks to enhance focus and productivity.",
        link: "/pomodoro",
      },
      {
        name: "1-3-5 Method",
        description: "Focus on 1 big task, 3 medium tasks, and 5 small tasks each day.",
        link: "/1-3-5",
      },
      {
        name: "Kanban",
        description: "Visualize tasks using a board and limit work in progress.",
        link: "/kanban",
      },
      {
        name: "Normal To-Do List",
        description: "Create a normal daily To-Do list to breeze through your tasks.",
        link: "/to-do-list",
      },
      {
        name: "Take notes",
        description: "Map out your thoughts and ideas.",
        link: "/mindMap",
      },
    ];
  
    return (
      <body className={dmSans.className}>
      <main className='min-h-screen'>
      <SelectionPane frameworks={frameworks}/>
      </main>
      </body>
    );
  }
  