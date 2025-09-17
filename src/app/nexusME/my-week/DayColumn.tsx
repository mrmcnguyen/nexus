"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskBlock from "./TaskBlock";
import { PlannerTask } from "./types";

export default function DayColumn({
  dayIndex,
  weekKey,
  tasks,
  onSlotClick,
  onTaskClick,
}: {
  dayIndex: number;
  weekKey: string;
  tasks: PlannerTask[];
  onSlotClick: (dayIndex: number, hour: number) => void;
  onTaskClick: (t: PlannerTask) => void;
}) {
  const HOURS_LOCAL = Array.from({ length: 18 }, (_, i) => i + 6);
  return (
    <motion.div
      key={`${weekKey}-${dayIndex}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative border border-neutral-800 bg-neutral-950 rounded-md overflow-hidden"
    >
      <div className="relative">
        {HOURS_LOCAL.map((h) => (
          <motion.div
            key={h}
            whileHover={{ backgroundColor: "#0b0b0b" }}
            className="h-16 border-b border-neutral-900/80 cursor-pointer"
            onClick={() => onSlotClick(dayIndex, h)}
          />
        ))}
        <div className="absolute inset-0">
          <AnimatePresence>
            {tasks
              .filter((t) => t.dayIndex === dayIndex)
              .map((t) => (
                <TaskBlock key={t.id} task={t} onClick={onTaskClick} />
              ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}


