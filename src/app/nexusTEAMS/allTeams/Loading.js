import { FiFolder, FiPlus, FiSearch, FiFilter } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="min-h-screen p-8 text-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
            <FiFolder className="mr-4 text-[#91C8FF]" size={40} />
            Your Projects
          </h1>
          <button className="bg-[#6f99d8] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition">
            <FiPlus className="mr-2" size={20} />
            New Project
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-[#1f1f1f] border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#91C8FF] text-white px-4 py-2 rounded-lg pl-10"
              disabled
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          <button className="bg-[#1f1f1f] border border-[#333] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#2a2a2a] transition">
            <FiFilter className="mr-2" size={20} />
            Filters
          </button>
        </div>

        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] border border-[#333] rounded-xl p-6 w-full max-w-[320px] mx-auto animate-pulse"
            >
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
