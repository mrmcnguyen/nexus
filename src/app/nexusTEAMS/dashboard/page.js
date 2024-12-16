import Image from "next/image";
import DashboardHeader from './dashboardHeader';
import DashboardSector from './dashboardSectors';
import DashboardFooter from './dashboardFooter';

export const metadata = {
  title: "[IN DEVELOPMENT] DASHBOARD",
};

export default function Page() {
  const sectors = [
    { name: "Marketing", progress: "63", manager: "John Doe", status: "UP TO DATE" },
    { name: "Software Development", progress: "24", manager: "Pablo Cortez", status: "UP TO DATE" },
    { name: "Employment", progress: "100", manager: "Karen Suh", status: "DONE" },
    { name: "Marking", progress: "13", manager: "Henry Luo", status: "BEHIND" },
    { name: "Management: Roster", progress: "64", manager: "Linsey Coro", status: "UP TO DATE" },
    { name: "Marketing", progress: "63", manager: "John Doe", status: "UP TO DATE" },
    { name: "Software Development", progress: "24", manager: "Pablo Cortez", status: "UP TO DATE" },
    { name: "Employment", progress: "100", manager: "Karen Suh", status: "DONE" },
    { name: "Marking", progress: "13", manager: "Henry Luo", status: "BEHIND" },
    { name: "Management: Roster", progress: "64", manager: "Linsey Coro", status: "UP TO DATE" },
    { name: "Marketing", progress: "63", manager: "John Doe", status: "UP TO DATE" },
    { name: "Software Development", progress: "24", manager: "Pablo Cortez", status: "UP TO DATE" },
    { name: "Employment", progress: "100", manager: "Karen Suh", status: "DONE" },
    { name: "Marking", progress: "13", manager: "Henry Luo", status: "BEHIND" },
    { name: "Management: Roster", progress: "64", manager: "Linsey Coro", status: "UP TO DATE" },
  ];

  const members = [
    {name: "John Dory", sector: "Marketing", role: "Social Media Marketing", status: "Online"},
    {name: "Hugh Janus", sector: "Software Development", role: "Frontend Engineer", status: "Online"},
    {name: "Kevin Kim", sector: "Software Development", role: "Backend Engineer", status: "Offline"},
    {name: "Alisson Becker", sector: "Marketing", role: "Social Media Marketing", status: "Offline"},
    {name: "Megan Liu", sector: "Employment", role: "Recruiter", status: "Online"},
    {name: "Kevin Kim", sector: "Software Development", role: "Backend Engineer", status: "Offline"},
    {name: "Alisson Becker", sector: "Marketing", role: "Social Media Marketing", status: "Offline"},
    {name: "Megan Liu", sector: "Employment", role: "Recruiter", status: "Online"},
  ];

  const tasks = [
    "Onboard New Employees",
    "Create new marking scheme",
    "Evaluate student performance metrics"
  ];

  return (
    <main className="flex flex-col h-full box-border">
  <div className="flex-none">
    <DashboardHeader
      organisation={"ReInspire Education"}
      manager={"Kevin Lee"}
      status={"Active"}
    />
  </div>

  <div className="flex flex-col flex-1 overflow-hidden">
    <div className="h-[50%] overflow-y-auto mb-4">
      <DashboardSector sectors={sectors} />
    </div>
    <div className="h-[50%] overflow-y-auto">
      <DashboardFooter members={members} tasks={[]} />
    </div>
  </div>
</main>

  );
}