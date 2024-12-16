
import { Sidebar } from "../Sidebar";

export default function Layout({ children }) {
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <Sidebar />
        <div className="flex-grow p-6 md:overflow-y-hidden md:p-4">{children}</div>
      </div>
    );
  }