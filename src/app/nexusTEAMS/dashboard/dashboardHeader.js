import Image from "next/image";

export default function DashboardHeader( { organisation, manager, status } ) {
    return (
        <>
        {/* Main Header Info */}
  <div className="w-full">
    <div className="flex flex-row gap-x-8 h-auto justify-between">
      {/* Organisation Name */}
      <div className="flex flex-row gap-x-8">
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div className="text-xs text-gray-500">Organisation</div>
            <h1 className="text-xl">{organisation}</h1>
        </div>
      </div>

      {/* Project Manager */}
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div className="text-xs text-gray-500">Project Manager</div>
          <h1 className="text-xl">{manager}</h1>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div className="text-xs text-gray-500">Status</div>
          <h1 className="text-xl text-emerald-200">{status}</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-x-2">
      <div className="relative">
      <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
        <Image
          src={'/notification.svg'}
          alt="Notification Bell Icon"
          width={15}
          height={15}
        />
      </button>
      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#91C8FF] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#91C8FF]"></span>
      </span>
    </div>


      {/* Account Circle */}
      <div>
        <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
        <Image
          src={'/accountBlue.svg'}
          alt="Account Icon"
          width={15}
          height={15}
          />
        </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
}