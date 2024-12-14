import Image from "next/image";
import DashboardHeader from './dashboardHeader'
import DashboardSector from './dashboardSectors';

export const metadata = {
  title: "[IN DEVELOPMENT] DASHBOARD",
};

export default function Page() {

  const sectors = [
    {name: "Marketing",
    progress: "63",
    manager: "John Doe",
    status: "Up to Date"},

    {name: "Software Development",
    progress: "24",
    manager: "Pablo Cortez",
    status: "Up to Date"},

    {name: "Employment",
    progress: "100",
    manager: "Karen Suh",
    status: "Done"},

    {name: "Marking",
    progress: "13",
    manager: "Henry Luo",
    status: "Behind"}
  ]
  return (
    <main className="flex flex-col min-h-screen"> 
      <DashboardHeader
        organisation={"ReInspire Education"}
        manager={"Kevin Lee"}
        status={"Active"}
      />
      <DashboardSector 
      sectors={sectors}
      />
    </main>
  );
}
