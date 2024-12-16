export default function DashboardSector({ sectors }) {
    return (
      <>
        {/* Sectors List */}
        <div className="p-4 h-full rounded-lg bg-[#1f1f1f]">
          {/* Header Section */}
          <div className="flex flex-row w-full justify-between">
            <div>
              <h2 className="text-base 2xl:text-lg font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Project Sectors
              </h2>
            </div>
            <button className="bg-[#292929] rounded-lg text-sm text-gray-400 border border-[#454545] p-1">
              Manage
            </button>
          </div>
  
          {/* Table Headers */}
          <div className="grid grid-cols-4 gap-4 text-sm pl-2 font-light text-gray-500 border-b border-gray-700 py-2">
            <div>SECTOR</div>
            <div>PROGRESS</div>
            <div>MANAGER</div>
            <div>STATUS</div>
          </div>
  
          {/* Scrollable List of Sectors */}
          <div className="mt-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {sectors.length > 0 ? (
            sectors.map((sector, index) => (
                <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center py-2 pl-2 rounded-lg hover:bg-[#292929]"
                >
                <div className="text-sm text-gray-300">{sector.name}</div>
                <div className="flex items-center">
                    <div className="w-full bg-gray-600 rounded-full h-0.5">
                    <div
                        className={`bg-[#6cb4fc] h-0.5 rounded-full ${
                        sector.progress === "100"
                            ? "bg-emerald-500"
                            : "bg-[#91C8FF]"
                        }`}
                        style={{ width: `${sector.progress}%` }}
                    ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-300">{sector.progress}%</span>
                </div>
                <div className="text-sm text-gray-300">{sector.manager}</div>
                <div
                    className={`text-xs font-semibold uppercase ${
                    sector.status === "DONE"
                        ? "text-emerald-300"
                        : sector.status === "BEHIND"
                        ? "text-red-700"
                        : "text-[#91C8FF]"
                    }`}
                >
                    {sector.status}
                </div>
                </div>
            ))
            ) : (
            <div className="text-gray-500 text-center py-4">
                This project has no sectors
            </div>
            )}

          </div>
        </div>
      </>
    );
  }
  