"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAYS, HOURS, PlannerTask } from "./types";

export default function TaskModal({
  isOpen,
  initialDay,
  initialHour,
  task,
  onClose,
  onSave,
  onDelete,
}: {
  isOpen: boolean;
  initialDay: number | null;
  initialHour: number | null;
  task: PlannerTask | null;
  onClose: () => void;
  onSave: (t: Omit<PlannerTask, "id">, existingId?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [startHour, setStartHour] = useState<number>(initialHour ?? 9);
  const [endHour, setEndHour] = useState<number>((initialHour ?? 9) + 1);
  const [dayIndex, setDayIndex] = useState<number>(initialDay ?? 0);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStartHour(task.startHour);
      setEndHour(task.endHour);
      setDayIndex(task.dayIndex);
    } else {
      setTitle("");
      setStartHour(initialHour ?? 9);
      setEndHour((initialHour ?? 9) + 1);
      setDayIndex(initialDay ?? 0);
    }
  }, [task, initialDay, initialHour, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-neutral-900 border border-neutral-800 p-5 w-full max-w-md shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{task ? "Edit Task" : "New Task"}</h3>
            <button className="text-slate-400 hover:text-slate-200" onClick={onClose}>✕</button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <input
                className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-700"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Day</label>
                <select
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-gray-100"
                  value={dayIndex}
                  onChange={(e) => setDayIndex(Number(e.target.value))}
                >
                  {DAYS.map((d, i) => (
                    <option key={d} value={i}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Start</label>
                  <select
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-gray-100"
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">End</label>
                  <select
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-gray-100"
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h + 1}>{h + 1}:00</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            {task ? (
              <button
                className="text-red-300 hover:text-red-200 text-sm"
                onClick={() => task && onDelete(task.id)}
              >
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-gray-200 hover:bg-neutral-700 text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                onClick={() => {
                  if (!title.trim()) return;
                  const payload = {
                    title: title.trim(),
                    dayIndex,
                    startHour: Math.min(startHour, endHour - 1),
                    endHour: Math.max(endHour, startHour + 1),
                    colorClass: "bg-blue-500/15 border border-blue-500/20 text-blue-300",
                  } as Omit<PlannerTask, "id">;
                  onSave(payload, task?.id);
                }}
              >
                Save
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


