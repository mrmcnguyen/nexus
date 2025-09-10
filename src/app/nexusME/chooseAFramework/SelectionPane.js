'use client'
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";

export default function SelectionPane({ frameworks }) {
  const [selectedFramework, setSelectedFramework] = useState(null);

  return (
    <div className="p-12 bg-black flex flex-col min-h-screen justify-center items-center">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto lg:max-w-6xl">
        {frameworks.map((framework) => (
          <Link href={framework.link} key={framework.name}>
          <div
            key={framework.name}
            onClick={() => setSelectedFramework(framework)} // Set selected framework when clicked
            className={`p-6 bg-black border border-neutral-800 rounded-lg transition duration-300 ease-in-out cursor-pointer 
            ${selectedFramework?.name === framework.name ? "scale-105 shadow-2xl border border-[#6F99D8]" : "hover:bg-neutral-800 transform hover:scale-105"}`}
          >
            <h2 className="text-xl tracking-tight font-semibold text-white mb-2">{framework.name}</h2>
            <p className="text-gray-400 tracking-tight">{framework.description}</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
