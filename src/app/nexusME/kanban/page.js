import Navbar from "../Navbar";
import KanbanComponent from "./Kanban";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
    title: "Individual Kanban Board",
  };

  export default function Kanban() {
    return (
      <>
        <Navbar page={'/nexusME/kanban'} />
        <div style={{ paddingTop: '50px' }}> 
          <KanbanComponent />
        </div>
        </>
    );
  }
  