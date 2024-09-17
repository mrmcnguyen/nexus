import Pomodoro from "./Pomodoro";
import Navbar from "../Navbar"
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function PomodoroPage() {
  return (
    <body className={`min-h-screen ${dmSans.className}`}>
    <Navbar page={'/nexusME/pomodoro'} />
    <Pomodoro/>
  </body>
  );
}
