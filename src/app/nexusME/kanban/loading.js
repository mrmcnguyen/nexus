import Navbar from '../Navbar';
import Image from 'next/image';

export default function Loading() {

    return (
        <>
        <Navbar></Navbar>

        <div className="p-8 pt-4 min-h-screen flex flex-col bg-[#171717]">
        <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex flex-row items-center">
                <h1 className="text-5xl text-gray-300 font-normal text-left lg:text-4xl md:text-3xl 2xl:text-4xl">Kanban Board</h1>
                <span className="flex flex-row items-center m-4 border border-[#2F2F2F] bg-[#2F2F2F] text-gray-400 text-xs rounded-2xl px-2">
                    <Image
                        src="/synced.svg"
                        width={14}
                        className="mr-1 mt-1 mb-1"
                        height={14}
                        alt="t"
                        priority
                    />
                    <i className="fa-solid fa-sync fa-spin"></i>
                    Syncing...
                </span>
            </div>
            <div className="flex flex-row space-x-4">
                <button className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]">
                    <Image
                        src="/list.svg"
                        style={{ filter: 'invert(1)' }}
                        className="mr-2"  
                        width={14}
                        alt="t"
                        height={14}
                        priority
                    />
                    View as List
                </button>
                <button className="flex flex-row border border-[#2F2F2F] lg:text-sm 2xl:text-base bg-[#1f1f1f] items-center px-4 py-2 text-gray-300 transition duration-200 align-middle text-light rounded-lg hover:bg-[#707070]">
                    <Image
                        src="/team.svg" 
                        style={{ filter: 'invert(1)' }}
                        className="mr-2"  
                        width={14}
                        alt="team"
                        height={14}
                        priority
                    />
                    View Team Kanban Board
                </button>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
        {['Backlog', 'To Do', 'In Progress', 'Done'].map((status) => (
          <div
            key={status}
            className="p-4 rounded-lg flex flex-col overflow-y-auto"
          >
            {/* Column Header */}
            <div className="flex flex-row items-center mb-4">
              <Image
                src={`/${status.toLowerCase().replace(' ', '')}.svg`}
                className="mr-2"
                width={14}
                height={14}
                alt={status}
                priority
              />
              <h2 className="lg:text-lg 2xl:text-xl text-gray-300 font-light">{status}</h2>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
  }