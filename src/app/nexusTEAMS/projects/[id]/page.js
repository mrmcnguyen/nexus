import DashboardHeader from './dashboardHeader';
import DashboardSector from './dashboardSectors';
import DashboardMembers from './dashboardMembers';

export const metadata = {
  title: "[IN DEVELOPMENT] DASHBOARD",
};

export default async function Page( { params } ) {

  const { id } = await params;

  return (
    <main className="flex flex-col h-full box-border">
  <div className="flex-none">
    <DashboardHeader id={id}
    />
  </div>

  <div className="flex flex-col flex-1 overflow-hidden">
    <div className="h-[50%] overflow-y-auto mb-4">
      <DashboardSector id={id} />
    </div>
    <div className="h-[50%] overflow-y-auto">
      <DashboardMembers id={id} />
    </div>
  </div>
</main>

  );
}