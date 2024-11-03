import Navbar from "../Navbar";
import KanbanComponent from "./Kanban";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
    title: "Individual Kanban Board",
  };

  export default function Kanban() {
    return (
      <body className={`text-black ${dmSans.className}`}>
        <Navbar page={'/nexusME/kanban'} />
        <div style={{ paddingTop: '60px' }}> 
          <KanbanComponent />
        </div>
      </body>
    );
  }
  