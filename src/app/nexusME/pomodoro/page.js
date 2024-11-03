import Pomodoro from "./Pomodoro";
import Navbar from "../Navbar"
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Pomodoro",
};

export default function PomodoroPage() {
  return (
    <body className={`overflow-y-hidden ${dmSans.className}`}>
    <Navbar page={'/nexusME/pomodoro'} />
    <div style={{ paddingTop: '60px' }}> 
          <Pomodoro />
        </div>
  </body>
  );
}
