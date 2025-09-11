"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar";

type PlannerTask = {
  id: string;
  title: string;
  description?: string;
  dayIndex: number; // 0-6 (Sun-Sat)
  startHour: number; // 0-23
  endHour: number; // 1-24 (exclusive)
  colorClass?: string; // Tailwind color class for accent
};

const HOURS: number[] = Array.from({ length: 18 }, (_, i) => i + 6); // 6 -> 23
const DAYS: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday as start
  const res = new Date(d.setDate(diff));
  res.setHours(0, 0, 0, 0);
  return res;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatMD(date: Date): string {
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${m}/${d}`;
}

// Header with week navigation and days
function WeekHeader({
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

// Sidebar with hours
function TimeSidebar() {
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

function TaskBlock({ task, hourHeight = 64, onClick }: { task: PlannerTask; hourHeight?: number; onClick: (t: PlannerTask) => void; }) {
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
      className={`absolute left-1 right-1 rounded-md px-2 py-1 text-xs cursor-pointer hover:brightness-110 ${color}`}
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

function DayColumn({
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
      {/* Hour grid */}
      <div className="relative">
        {HOURS.map((h) => (
          <motion.div
            key={h}
            whileHover={{ backgroundColor: "#0b0b0b" }}
            className="h-16 border-b border-neutral-900/80 cursor-pointer"
            onClick={() => onSlotClick(dayIndex, h)}
          />
        ))}

        {/* Tasks Layer */}
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

function TaskModal({
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 w-full max-w-md shadow-xl"
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

export default function WeeklyPlannerPage() {
  const [anchorDate, setAnchorDate] = useState<Date>(startOfWeek(new Date()));
  const [tasks, setTasks] = useState<PlannerTask[]>([
    {
      id: "t-1",
      title: "Deep Work",
      dayIndex: 1,
      startHour: 9,
      endHour: 11,
      colorClass: "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300",
    },
    {
      id: "t-2",
      title: "Team Sync",
      dayIndex: 2,
      startHour: 14,
      endHour: 15,
      colorClass: "bg-purple-500/15 border border-purple-500/20 text-purple-300",
    },
  ]);

  const weekKey = useMemo(() => anchorDate.toISOString().slice(0, 10), [anchorDate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState<PlannerTask | null>(null);
  const [modalInitialDay, setModalInitialDay] = useState<number | null>(null);
  const [modalInitialHour, setModalInitialHour] = useState<number | null>(null);

  const goPrev = useCallback(() => setAnchorDate((d) => addDays(d, -7)), []);
  const goNext = useCallback(() => setAnchorDate((d) => addDays(d, 7)), []);
  const goToday = useCallback(() => setAnchorDate(startOfWeek(new Date())), []);

  const handleSlotClick = (dayIndex: number, hour: number) => {
    setModalTask(null);
    setModalInitialDay(dayIndex);
    setModalInitialHour(hour);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: PlannerTask) => {
    setModalTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (payload: Omit<PlannerTask, "id">, existingId?: string) => {
    if (existingId) {
      setTasks((prev) => prev.map((t) => (t.id === existingId ? { ...t, ...payload } : t)));
    } else {
      const id = `t-${Math.random().toString(36).slice(2, 9)}`;
      setTasks((prev) => [
        ...prev,
        { id, title: payload.title, dayIndex: payload.dayIndex, startHour: payload.startHour, endHour: payload.endHour, colorClass: payload.colorClass },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar page={'/nexusME/my-week'} />
      <div style={{ paddingTop: '50px' }}>
        <div className="p-6 min-h-screen flex flex-col bg-black">
          <WeekHeader weekStart={anchorDate} onPrev={goPrev} onNext={goNext} onToday={goToday} />

          <div className="flex-1 overflow-auto">
            <div className="grid gap-2" style={{ gridTemplateColumns: "80px repeat(7, minmax(180px, 1fr))" }}>
              <TimeSidebar />
              <AnimatePresence initial={false} mode="wait">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <DayColumn
                    key={`${weekKey}-${dayIndex}`}
                    dayIndex={dayIndex}
                    weekKey={weekKey}
                    tasks={tasks}
                    onSlotClick={handleSlotClick}
                    onTaskClick={handleTaskClick}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <TaskModal
            isOpen={isModalOpen}
            initialDay={modalInitialDay}
            initialHour={modalInitialHour}
            task={modalTask}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>
    </>
  );
}


