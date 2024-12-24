'use client'
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";

export default function SelectionPane({ frameworks }) {
  const [selectedFramework, setSelectedFramework] = useState(null);

  return (
    <div className="p-12 flex flex-col min-h-screen justify-center items-center">
      {/* <h1 className="text-5xl font-bold text-white text-center mb-4 lg:text-7xl">Choose a framework for today.</h1> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto lg:max-w-6xl">
        {frameworks.map((framework) => (
          <div
            key={framework.name}
            onClick={() => setSelectedFramework(framework)} // Set selected framework when clicked
            className={`p-6 bg-[#1f1f1f] rounded-lg transition duration-300 ease-in-out cursor-pointer 
            ${selectedFramework?.name === framework.name ? "scale-105 shadow-2xl border border-[#6F99D8]" : "hover:shadow-2xl transform hover:scale-105"}`}
          >
            <h2 className="text-xl font-semibold text-white mb-2">{framework.name}</h2>
            <p className="text-gray-400">{framework.description}</p>
          </div>
        ))}
      </div>

      {/* Get Started Button */}
      {selectedFramework && (
        <Link href={selectedFramework.link}>
          <button className="p-4 bg-[#6F99D8] mt-8 mx-auto block text-white rounded-lg hover:bg-[#7896c8] transition">
            Get Started with {selectedFramework.name}
          </button>
        </Link>
      )}
    </div>
  );
}
