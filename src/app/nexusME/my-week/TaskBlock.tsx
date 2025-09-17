"use client";

import React from "react";
import { motion } from "framer-motion";
import { HOURS, PlannerTask } from "./types";

export default function TaskBlock({ task, hourHeight = 64, onClick }: { task: PlannerTask; hourHeight?: number; onClick: (t: PlannerTask) => void; }) {
  const top = (task.startHour - HOURS[0]) * hourHeight;
  const height = Math.max((task.endHour - task.startHour) * hourHeight - 6, 32);
  const color = task.colorClass || "bg-blue-500/15 border border-blue-500/20 text-blue-300";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`absolute left-1 right-1 rounded-md px-2 py-1 text-xs cursor-pointer hover:brightness-110 pointer-events-auto ${color}`}
      style={{ top, height }}
      onClick={(e) => { e.stopPropagation(); onClick(task); }}
    >
      <div className="font-medium truncate">{task.title}</div>
      <div className="text-[10px] opacity-80">
        {`${task.startHour}:00`} – {`${task.endHour}:00`}
      </div>
    </motion.div>
  );
}