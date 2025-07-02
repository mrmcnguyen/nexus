import LoadingQuadrant from './LoadingQuadrant';
import Navbar from '../Navbar';
import Image from 'next/image';

export default function Loading() {

  return (
    <>
      <Navbar></Navbar>
      <div className="h-screen flex p-4 bg-[#171717] space-x-8">
        <div className="w-1/4 bg-[#1a1a1a] border border-[#333] shadow-2xl rounded-xl p-6 h-full flex flex-col">
          <div className='flex flex-row justify-between items-center mb-4'>
            <h2 className="text-lg font-medium text-gray-100">Backlog</h2>
            <Image
              src="/help.svg"
              className="mx-2"
              width={16}
              alt="Help"
              height={16}
              priority
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 animate-pulse">
            <div className="bg-[#232323] border border-[#444] text-[#232323] p-3 rounded-lg shadow">e</div>
            <div className="bg-[#232323] border border-[#444] text-[#232323] p-3 rounded-lg shadow">e</div>
            <div className="bg-[#232323] border border-[#444] text-[#232323] p-3 rounded-lg shadow">e</div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-3/4 h-full">
          <LoadingQuadrant
            title="Urgent and Important"
            description="Do: Tasks with deadlines or consequences"
            bgColor="bg-top-left"
            textBoxColor="#afcfc1"
            borderRoundness="rounded-tl-lg"
            border="border border-[#2F2F2F]"
            quadrant="do"
          />
          <LoadingQuadrant
            title="Not Urgent but Important"
            description="Schedule: Tasks with unclear deadlines that contribute to long-term success"
            bgColor="bg-top-right"
            textBoxColor="#f2a18d"
            borderRoundness="rounded-tr-lg"
            border="border-t border-r border-b border-[#2F2F2F]"
            quadrant="schedule"
          />
          <LoadingQuadrant
            title="Urgent but Not Important"
            description="Delegate: Tasks that must get done but don't require your specific skill set"
            bgColor="bg-bottom-left"
            textBoxColor="#98b1e7"
            borderRoundness="rounded-bl-lg"
            border="border-b border-l border-r border-[#2F2F2F]"
            quadrant="delegate"
          />
          <LoadingQuadrant
            title="Not Urgent and Not Important"
            description="Delete: Distractions and unnecessary tasks"
            bgColor="bg-bottom-right"
            textBoxColor="#f5898d"
            borderRoundness="border-b border-r border-[#2F2F2F] rounded-br-lg"
            quadrant="eliminate"
          />
        </div>
      </div>
    </>
  );
}