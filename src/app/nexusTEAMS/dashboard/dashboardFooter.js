export default function DashboardFooter({ members, tasks }) {
    return (
        <div className="grid grid-cols-2 h-full gap-4 mt-4">
            {/* Members Section */}
            <div className="rounded-lg bg-[#1F1F1F] shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Team Members
                </h2>
                <div className="grid grid-cols-4 gap-4 text-sm pl-2 font-light text-gray-500 border-b border-gray-700 py-2">
                    <div>NAME</div>
                    <div>SECTOR</div>
                    <div>ROLE</div>
                    <div>STATUS</div>
                </div>
                <ul className="space-y-2">
                    {members.length > 0 ? (members.map((member, index) => (
                        <div
                        key={index}
                        className="grid grid-cols-4 gap-4 items-center py-2 pl-2 rounded-lg hover:bg-[#1f1f1f]"
                    >
                        <div className="text-sm text-gray-300">{member.name}</div>
                        <div className="text-sm text-gray-300">{member.sector}</div>
                        <div className="text-sm text-gray-300">{member.role}</div>
                        <div className="text-sm text-white">{member.status}</div>
                    </div>
                    ))):
                    <div className="text-gray-500 text-center py-4">
                    No Members
                        </div>}
                </ul>
            </div>

            {/* Tasks Section */}
            <div className="bg-[#1F1F1F] rounded-lg shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Pending Tasks
                </h2>
                <ul className="space-y-2">
                    {tasks.map((task, index) => (
                        <li 
                            key={index} 
                            className="text-sm text-gray-400 flex items-center space-x-2"
                        >
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>{task}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}