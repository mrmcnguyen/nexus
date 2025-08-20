import Pomodoro from "./Pomodoro";
import Navbar from "../Navbar"
import { DM_Sans } from "next/font/google";
import { Suspense } from "react";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Pomodoro",
};

export default function PomodoroPage() {
  return (
    <>
      <Navbar page={'/nexusME/pomodoro'} />
      <div style={{ paddingTop: '50px' }}>
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <Pomodoro />
        </Suspense>
      </div>
    </>
  );
}
