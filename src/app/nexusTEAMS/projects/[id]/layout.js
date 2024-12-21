import { Sidebar } from "./Sidebar";

export default async function Layout({ children, params }) {

    const id = await params;

    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-y-auto
      ">
          <Sidebar id={id} />
        <div className="flex-grow p-6 md:p-4">{children}</div>
      </div>
    );
  }