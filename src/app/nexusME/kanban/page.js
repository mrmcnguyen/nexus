import Navbar from "../Navbar";
import KanbanComponent from "./Kanban";
import Loading from "./loading";
import { Suspense } from "react";
import { fetchKanbanTasks } from "../../kanban-actions";
import { createClient } from "../../../../supabase/serverComponentClient";

export const metadata = {
  title: "Individual Kanban Board",
};

export default async function Kanban() {

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(); // 👈 fetch logged-in user from cookies/session

  console.log(user);

  const tasks = await fetchKanbanTasks(user.id); // 👈 pass the real user.id

  return (
    <>
      <Navbar page={"/nexusME/kanban"} />
      <div style={{ paddingTop: "50px" }}>
        <Suspense fallback={<Loading />}>
          <KanbanComponent initialTasks={tasks} />
        </Suspense>
      </div>
    </>
  );
}
