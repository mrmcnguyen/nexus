export default function DashboardSector({ sectors }){
    return (
        <>
      {/* Sectors List */}
    <div className="mt-8">
    {/* Table Headers */}
    <div className="grid grid-cols-4 gap-4 text-sm font-light text-gray-500 border-b border-gray-700 pb-2">
        <div>Sector</div>
        <div>Progress</div>
        <div>Manager</div>
        <div>Status</div>
    </div>
    {/* List of Sectors */}
    {sectors.map((sector, index) => (
        <div
            key={index}
            className="grid grid-cols-4 gap-4 items-center border-b border-gray-700 py-2"
        >
            <div className="text-gray-300">{sector.name}</div>
            <div className="flex items-center">
                <div className="w-full bg-gray-600 rounded-full h-0.5">
                    <div
                        className={`bg-[#6cb4fc] h-0.5 rounded-full ${sector.progress === "100" ? 'bg-emerald-300' : ''}`}
                        style={{ width: `${sector.progress}%` }}
                    ></div>
                </div>
                <span className="ml-2 text-sm text-gray-300">{sector.progress}%</span>
            </div>
            <div className="text-gray-300">{sector.manager}</div>
            <div className="text-emerald-300">{sector.status}</div>
        </div>
    ))}
</div>  
        </>
    );
}