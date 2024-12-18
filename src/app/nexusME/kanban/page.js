import Navbar from "../Navbar";
import KanbanComponent from "./Kanban";
import Loading from "./loading";
import { Suspense } from "react";

export const metadata = {
    title: "Individual Kanban Board",
  };

  export default function Kanban() {
    return (
      <>
        <Navbar page={'/nexusME/kanban'} />
        <div style={{ paddingTop: '50px' }}> 
          <Suspense fallback={<Loading />}>
          <KanbanComponent />
          </Suspense>
        </div>
        </>
    );
  }
  