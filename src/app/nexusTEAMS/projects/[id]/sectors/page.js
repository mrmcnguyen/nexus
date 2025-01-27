'use client';
import DashboardHeader from "../dashboardHeader";
import Sectors from "./sectors";
import { useParams } from "next/navigation";

export default function Page() {

    const params = useParams();
    console.log(params);

  return (
    <main className="flex flex-col h-full box-border">

        <div className="flex-none">
            <DashboardHeader id={params.id}
            />
          </div>

  <div className="flex flex-col flex-1 overflow-hidden">
    <div className="h-full overflow-y-auto">
      <Sectors id={params.id} />
    </div>
  </div>
</main>

  );
}