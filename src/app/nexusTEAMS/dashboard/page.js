import Image from "next/image";
import DashboardHeader from './dashboardHeader';
import DashboardSector from './dashboardSectors';
import DashboardFooter from './dashboardFooter';

export const metadata = {
  title: "[IN DEVELOPMENT] DASHBOARD",
};

export default function Page() {

  const sectors = [
    { name: "Marketing", progress: "63", manager: "John Doe", status: "Up to Date" },
    { name: "Software Development", progress: "24", manager: "Pablo Cortez", status: "Up to Date" },
    { name: "Employment", progress: "100", manager: "Karen Suh", status: "Done" },
    { name: "Marking", progress: "13", manager: "Henry Luo", status: "Behind" },
  ];

  const members = [
    "John Dory",
    "John Pork",
    "Palbo Cortez",
    "Kevin Lee",
    "Jennifer Zhang",
    "Hugh Janus"
  ];

  const tasks = [
    "Onboard New Employees",
    "Create new marking scheme",
    "Evaluate student performance metrics"
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <DashboardHeader
        organisation={"ReInspire Education"}
        manager={"Kevin Lee"}
        status={"Active"}
      />

      {/* Sectors Section */}
      <div className="flex-grow overflow-y-auto">
        <DashboardSector sectors={sectors} />
      </div>

      {/* Members and Tasks Section */}
      <DashboardFooter
        members={members}      
        tasks={tasks}
      />
    </main>
  );
}
