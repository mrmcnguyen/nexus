'use client'
import React, { useState, useEffect, useRef } from 'react';

export default function LoadingQuadrant({
  title,
  description,
  borderRoundness,
  border,
}) {
  const [ulHeight, setUlHeight] = useState(null); // State to hold the fixed height
  const ulRef = useRef(null);

  // Function to handle resizing
  const updateHeight = () => {
    if (ulRef.current && ulHeight === null) {
      // Capture the natural height of the ul before setting any styles
      setUlHeight(ulRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    // Initial height capture
    updateHeight();

    // Add the resize event listener
    window.addEventListener('resize', updateHeight);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [ulHeight]); // Only run once when ulHeight is null or changed

  return (
    <div
      className={`p-6 bg-[#1a1a1a] text-white ${borderRoundness} shadow-2xl flex flex-col h-full border border-[#333] transition-colors`}
    >
      <h2 className="text-lg font-medium text-gray-100 mb-1">{title}</h2>
      <p className="text-sm font-light text-gray-400 mb-4">{description}</p>
      <ul ref={ulRef} className="flex-grow w-full animate-pulse space-y-2">
        {/* Render loading skeleton */}
        <div className="bg-[#232323] border border-[#444] text-[#232323] p-3 rounded-lg shadow">e</div>
        <div className="bg-[#232323] border border-[#444] text-[#232323] p-3 rounded-lg shadow">e</div>
        <div className="bg-[#232323] border border-[#444] text-[#232323] p-3 rounded-lg shadow">e</div>
      </ul>
    </div>
  );
}
