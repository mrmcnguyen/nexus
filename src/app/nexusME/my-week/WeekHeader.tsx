"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { DAYS, addDays, formatMD } from "./types";

export default function WeekHeader({
  weekStart,
  onPrev,
  onNext,
  onToday,
}: {
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  const weekDates = useMemo(() => DAYS.map((_, idx) => addDays(weekStart, idx)), [weekStart]);

  return (
    <div className="sticky top-0 z-10 -mx-6 px-6 pb-4 bg-black/80 dark:bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/70">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Weekly Planner</h1>
          <span className="text-xs text-gray-300 border border-neutral-800 bg-neutral-900 rounded-xl px-2 py-1">
            {formatMD(weekDates[0])} – {formatMD(weekDates[6])}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            className="flex items-center bg-black border border-neutral-800 px-3 py-2 text-gray-100 text-sm rounded-md hover:bg-neutral-900 shadow-sm"
            onClick={onPrev}
          >
            Previous Week
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            className="flex items-center bg-black border border-neutral-800 px-3 py-2 text-gray-100 text-sm rounded-md hover:bg-neutral-900 shadow-sm"
            onClick={onToday}
          >
            Today
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            className="flex items-center bg-black border border-neutral-800 px-3 py-2 text-gray-100 text-sm rounded-md hover:bg-neutral-900 shadow-sm"
            onClick={onNext}
          >
            Next Week
          </motion.button>
        </div>
      </div>

      {/* Days Row */}
      <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: "80px repeat(7, minmax(180px, 1fr))" }}>
        <div />
        {weekDates.map((date, idx) => (
          <div key={idx} className="">
            <div className="flex flex-col items-center border border-neutral-800 bg-neutral-950 rounded-md py-2">
              <div className="text-gray-200 text-sm">{formatMD(date)}</div>
              <div className="text-gray-100 font-medium text-sm">{DAYS[idx]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


