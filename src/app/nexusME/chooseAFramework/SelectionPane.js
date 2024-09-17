'use client'
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";

export default function SelectionPane({ frameworks }) {
  const [selectedFramework, setSelectedFramework] = useState(null);

  return (
    <div className="p-12 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-center mb-4">Choose your framework for today</h1>
      <p className="mt-4 mb-8 inline-flex items-center">
  Unsure of what to pick?
  <Image
    src="/newTab.svg"
    className="ml-2"  
    width={14}
    height={14}
    priority
  />
</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {frameworks.map((framework) => (
          <div
            key={framework.name}
            onClick={() => setSelectedFramework(framework)} // Set selected framework when clicked
            className={`p-6 bg-white border-solid border border-[#c2c8d0] rounded-lg transition duration-300 ease-in-out cursor-pointer 
            ${selectedFramework?.name === framework.name ? "scale-105 shadow-2xl border-2 border-blue-500 bg-[#3B82F6]/50" : "hover:shadow-2xl transform hover:scale-105"}`}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{framework.name}</h2>
            <p className="text-gray-600">{framework.description}</p>
          </div>
        ))}
      </div>

      {/* Get Started Button */}
      {selectedFramework && (
        <Link href={selectedFramework.link}>
          <button className="p-4 bg-blue-400 mt-8 mx-auto block text-white rounded-lg hover:bg-[#7896c8] transition">
            Get Started with {selectedFramework.name}
          </button>
        </Link>
      )}
    </div>
  );
}
