
import TodoList from "./ToDoList";
import Navbar from "../Navbar"
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "To-do List",
};

export default function ToDoListPage() {
  return (
    <body className={`overflow-y-hidden ${dmSans.className}`}>
    <Navbar page={'/nexusME/to-do-list'} />
    <div style={{ paddingTop: '60px' }}> 
          <TodoList />
        </div>
  </body>
  );
}
