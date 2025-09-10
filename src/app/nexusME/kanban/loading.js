import Image from 'next/image';

export default function Loading() {
  const headerColors = {
    'Backlog': 'text-gray-200',
    'To Do': 'text-gray-200',
    'In Progress': 'text-gray-200',
    'Done': 'text-gray-200'
  };

  const borderColors = {
    'Backlog': 'border-neutral-800',
    'To Do': 'border-neutral-800',
    'In Progress': 'border-neutral-800',
    'Done': 'border-neutral-800'
  };

  const columnColors = {
    'Backlog': 'bg-neutral-950',
    'To Do': 'bg-neutral-950',
    'In Progress': 'bg-neutral-950',
    'Done': 'bg-neutral-950'
  };

  const loadingTaskCounts = {
    'Backlog': 4,
    'To Do': 3,
    'In Progress': 3,
    'Done': 2
  };

  const SkeletonTask = () => (
    <div className="p-4 bg-neutral-900 rounded-md shadow-sm border border-neutral-800">
      <div className="h-3 w-2/3 bg-neutral-800 rounded mb-3 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-2 w-full bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-2 w-5/6 bg-neutral-800 rounded animate-pulse"></div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="h-5 w-16 bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-3 w-10 bg-neutral-800 rounded animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen flex flex-col bg-black">
      <div className="sticky top-0 z-10 -mx-6 px-6 pb-4 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/70">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <h1 className="text-2xl text-white font-semibold tracking-tight">Personal Kanban</h1>
            <span className="flex flex-row items-center ml-3 border border-neutral-800 bg-neutral-900 text-gray-200 tracking-tight text-xs rounded-xl px-3 py-1 shadow-sm">
              <Image
                src="/syncing.svg"
                width={14}
                className="mr-1"
                height={14}
                alt="syncing"
                priority
              />
              Syncing...
            </span>
          </div>
          <div className="flex flex-row gap-2">
            <button
              className="flex flex-row items-center bg-black border border-neutral-800 px-3 py-2 text-gray-100 tracking-tight text-sm rounded-md hover:bg-neutral-900 transition-colors duration-200 shadow-sm"
              type="button"
              disabled
            >
              <Image
                src={'/filter.svg'}
                className="mr-2 filter invert"
                width={14}
                alt={"filter"}
                height={14}
                priority
              />
              Filter by Epic
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              className="flex flex-row bg-black border border-neutral-800 items-center px-3 py-2 text-gray-100 tracking-tight text-sm transition-colors duration-200 rounded-md hover:bg-neutral-900 shadow-sm"
              type="button"
              disabled
            >
              <Image
                src="/list.svg"
                className="mr-2 filter invert"
                width={14}
                alt="list"
                height={14}
                priority
              />
              View as List
            </button>
            <button
              className="flex flex-row bg-black border border-neutral-800 items-center px-3 py-2 text-gray-100 tracking-tight text-sm transition-colors duration-200 rounded-md hover:bg-neutral-900 shadow-sm"
              type="button"
              disabled
            >
              <Image
                src="/epic.svg"
                className="mr-2 filter invert"
                width={14}
                alt="epic"
                height={14}
                priority
              />
              Manage Epics
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 gap-4 overflow-x-auto">
        <div className="flex flex-row gap-4 w-full">
          {['Backlog', 'To Do', 'In Progress', 'Done'].map((status) => (
            <div
              key={status}
              className={`${columnColors[status]} rounded-md p-4 flex flex-col min-h-[600px] flex-1 min-w-[300px] border border-neutral-800 shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex flex-row items-center mb-4">
                <Image
                  src={`/${status.toLowerCase().replace(' ', '')}.svg`}
                  className="mr-3"
                  width={16}
                  height={16}
                  alt={status}
                  priority
                />
                <div className="flex flex-row w-full justify-between items-center">
                  <h2 className={`text-base ${headerColors[status]} tracking-tight font-semibold`}>
                    {status}
                  </h2>
                  <div className={`text-xs text-gray-200 border border-neutral-800 bg-black px-2 py-1 rounded-full font-medium`}>
                    {loadingTaskCounts[status]}
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {Array.from({ length: loadingTaskCounts[status] }).map((_, i) => (
                  <SkeletonTask key={i} />
                ))}

                {/* Add Task Section (skeleton) */}
                <div className="flex w-full text-sm rounded-xl items-center text-gray-300 p-3 border-2 border-dashed border-neutral-800 opacity-60">
                  <Image
                    src="/plus.svg"
                    className="mr-2"
                    width={14}
                    height={14}
                    alt="Add Task"
                    priority
                  />
                  Add Task
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
