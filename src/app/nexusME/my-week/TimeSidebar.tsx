"use client";

import React from "react";
import { HOURS } from "./types";

export default function TimeSidebar() {
  return (
    <div className="sticky left-0">
      <div className="flex flex-col">
        {HOURS.map((h) => (
          <div key={h} className="h-16 border-b border-neutral-900 pr-3 flex items-start justify-end">
            <div className="text-[11px] text-gray-400 pt-1">{`${h.toString().padStart(2, "0")}:00`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


