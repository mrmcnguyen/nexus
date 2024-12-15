export default function DashboardFooter({ members, tasks }){
    return (
        <>
        {/* Members and Tasks Section */}
      <div className="grid grid-cols-2 gap-4" style={{ flexShrink: 0 }}>
        {/* Members Section */}
        <div className="bg-[#1f1f1f] p-4 rounded-md shadow-md overflow-y-auto">
          <div className="text-lg mb-4">Team</div>
          <ul className="list-disc ml-4">
            {members.map((member, index) => (
              <li key={index} className="text-gray-200 mb-2">
                {member}
              </li>
            ))}
          </ul>
        </div>

        {/* Tasks Section */}
        <div className="bg-[#1f1f1f] p-4 rounded-md shadow-md overflow-y-auto">
          <div className="text-lg mb-4">Tasks</div>
          <ul className="list-disc ml-4">
            {tasks.map((task, index) => (
              <li key={index} className="text-gray-200 mb-2">
                {task}
              </li>
            ))}
          </ul>
        </div>
      </div>
        </>
    );
}