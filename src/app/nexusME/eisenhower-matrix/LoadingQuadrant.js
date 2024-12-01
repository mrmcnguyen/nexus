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
      className={`p-4 bg-[#1f1f1f] text-white ${borderRoundness} shadow-lg flex flex-col h-full ${border}`}
    >
      <h2 className="text-left lg:text-base 2xl:text-2xl text-gray-300">{title}</h2>
      <p className="text-left lg:text-sm 2xl:text-lg font-extralight text-gray-400 mb-4">
        {description}
      </p>
      <ul ref={ulRef} className="flex-grow w-full animate-pulse">
        {/* Render loading skeleton */}
        <div
          className={`bg-[#292929] text-[#292929] lg:text-sm 2xl:text-base p-2 my-2 rounded-lg px-4`}
        > e </div>
         <div
          className={`bg-[#292929] text-[#292929] lg:text-sm 2xl:text-base p-2 my-2 rounded-lg px-4`}
        > e </div>
         <div
          className={`bg-[#292929] text-[#292929] lg:text-sm 2xl:text-base p-2 my-2 rounded-lg px-4`}
        > e </div>
      </ul>
    </div>
  );
}
