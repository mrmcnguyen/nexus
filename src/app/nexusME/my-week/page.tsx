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
  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

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
      <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: "80px repeat(7, minmax(180px, 1fr))" }}>
        <div />
        {weekDates.map((date, idx) => {
          const isCurrentDay = isToday(date);
          return (
            <div key={idx} className="">
              <div className={`flex flex-col items-center border rounded-md py-2 ${
                isCurrentDay 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-neutral-800 bg-neutral-950'
              }`}>
                <div className={`text-sm ${
                  isCurrentDay ? 'text-blue-300 font-semibold' : 'text-gray-200'
                }`}>
                  {formatMD(date)}
                </div>
                <div className={`font-medium text-sm ${
                  isCurrentDay ? 'text-blue-200' : 'text-gray-100'
                }`}>
                  {DAYS[idx]}
                </div>
                {isCurrentDay && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </div>
            </div>
          );
        })}
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

// Helper function to detect overlapping tasks
function getOverlappingTasks(tasks: PlannerTask[]): PlannerTask[][] {
  const groups: PlannerTask[][] = [];
  const processed = new Set<string>();

  tasks.forEach(task => {
    if (processed.has(task.id)) return;

    const group: PlannerTask[] = [task];
    processed.add(task.id);

    // Find all tasks that overlap with this task
    tasks.forEach(otherTask => {
      if (processed.has(otherTask.id)) return;

      const overlaps = task.startHour < otherTask.endHour && task.endHour > otherTask.startHour;
      if (overlaps) {
        group.push(otherTask);
        processed.add(otherTask.id);
      }
    });

    groups.push(group);
  });

  return groups;
}

// Helper function to calculate layout for overlapping tasks
function calculateTaskLayout(tasks: PlannerTask[]): Array<PlannerTask & { left: number; width: number }> {
  if (tasks.length === 0) return [];

  // Sort tasks by start time
  const sortedTasks = [...tasks].sort((a, b) => a.startHour - b.startHour);
  
  return sortedTasks.map((task, index) => {
    const totalOverlapping = tasks.length;
    const width = 100 / totalOverlapping; // Each task gets equal width
    const left = (index / totalOverlapping) * 100; // Position based on index
    
    return {
      ...task,
      left,
      width
    };
  });
}

function TaskBlock({ 
  task, 
  hourHeight = 64, 
  onClick, 
  left = 0, 
  width = 100 
}: { 
  task: PlannerTask; 
  hourHeight?: number; 
  onClick: (t: PlannerTask) => void;
  left?: number;
  width?: number;
}) {
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
      className={`absolute rounded-md px-2 py-1 text-xs cursor-pointer hover:brightness-110 pointer-events-auto z-20 ${color}`}
      style={{
        top,
        height,
        left: `calc(${left}% + 2px)`,
        width: `calc(${width}% - 4px)`,
      }}
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
            whileHover={{ backgroundColor: "rgba(48, 48, 48, 0.5)" }}
            className="h-16 border-b border-neutral-900/80 cursor-pointer relative z-0"
            onClick={() => onSlotClick(dayIndex, h)}
          />
        ))}

        {/* Tasks Layer */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <AnimatePresence>
            {(() => {
              const dayTasks = tasks.filter((t) => t.dayIndex === dayIndex);
              const overlappingGroups = getOverlappingTasks(dayTasks);
              
              return overlappingGroups.map((group, groupIndex) => {
                const layoutTasks = calculateTaskLayout(group);
                return layoutTasks.map((task) => (
                  <TaskBlock 
                    key={task.id} 
                    task={task} 
                    onClick={onTaskClick}
                    left={task.left}
                    width={task.width}
                  />
                ));
              }).flat();
            })()}
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
          className="bg-black/90 border border-neutral-900 rounded-md p-5 w-full max-w-md shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{task ? "Edit Task" : "New Task"}</h3>
            <button className="text-slate-400 hover:text-slate-200" onClick={onClose}>✕</button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <input
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-700"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Day</label>
                <select
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-gray-100"
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
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-gray-100"
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
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-gray-100"
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
                className="px-4 py-2 rounded-md text-gray-200 hover:bg-neutral-700 text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
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
    // Monday - with overlapping tasks
    {
      id: "t-1",
      title: "Morning Standup",
      dayIndex: 1,
      startHour: 9,
      endHour: 9.5,
      colorClass: "bg-blue-500/15 border border-blue-500/20 text-blue-300",
    },
    {
      id: "t-2",
      title: "Deep Work Session",
      dayIndex: 1,
      startHour: 10,
      endHour: 12,
      colorClass: "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300",
    },
    // Overlapping tasks at 10:30-11:30
    {
      id: "t-2a",
      title: "Team Sync",
      dayIndex: 1,
      startHour: 10.5,
      endHour: 11.5,
      colorClass: "bg-cyan-500/15 border border-cyan-500/20 text-cyan-300",
    },
    {
      id: "t-2b",
      title: "Client Call",
      dayIndex: 1,
      startHour: 10.5,
      endHour: 11.5,
      colorClass: "bg-violet-500/15 border border-violet-500/20 text-violet-300",
    },
    {
      id: "t-3",
      title: "Client Meeting",
      dayIndex: 1,
      startHour: 14,
      endHour: 15,
      colorClass: "bg-purple-500/15 border border-purple-500/20 text-purple-300",
    },
    // Overlapping tasks at 14:30-15:30
    {
      id: "t-3a",
      title: "Design Review",
      dayIndex: 1,
      startHour: 14.5,
      endHour: 15.5,
      colorClass: "bg-amber-500/15 border border-amber-500/20 text-amber-300",
    },
    {
      id: "t-3b",
      title: "Code Review",
      dayIndex: 1,
      startHour: 14.5,
      endHour: 15.5,
      colorClass: "bg-orange-500/15 border border-orange-500/20 text-orange-300",
    },
    {
      id: "t-3c",
      title: "Testing",
      dayIndex: 1,
      startHour: 14.5,
      endHour: 15.5,
      colorClass: "bg-rose-500/15 border border-rose-500/20 text-rose-300",
    },
    {
      id: "t-4",
      title: "Planning Session",
      dayIndex: 1,
      startHour: 17,
      endHour: 18,
      colorClass: "bg-pink-500/15 border border-pink-500/20 text-pink-300",
    },

    // Tuesday - with overlapping tasks
    {
      id: "t-6",
      title: "Sprint Planning",
      dayIndex: 2,
      startHour: 9,
      endHour: 10.5,
      colorClass: "bg-indigo-500/15 border border-indigo-500/20 text-indigo-300",
    },
    {
      id: "t-7",
      title: "Feature Development",
      dayIndex: 2,
      startHour: 11,
      endHour: 13,
      colorClass: "bg-cyan-500/15 border border-cyan-500/20 text-cyan-300",
    },
    // Overlapping tasks at 11:30-12:30
    {
      id: "t-7a",
      title: "Code Review",
      dayIndex: 2,
      startHour: 11.5,
      endHour: 12.5,
      colorClass: "bg-lime-500/15 border border-lime-500/20 text-lime-300",
    },
    {
      id: "t-7b",
      title: "Bug Fix",
      dayIndex: 2,
      startHour: 11.5,
      endHour: 12.5,
      colorClass: "bg-red-500/15 border border-red-500/20 text-red-300",
    },
    {
      id: "t-8",
      title: "Lunch Break",
      dayIndex: 2,
      startHour: 13,
      endHour: 14,
      colorClass: "bg-gray-500/15 border border-gray-500/20 text-gray-300",
    },
    {
      id: "t-9",
      title: "API Integration",
      dayIndex: 2,
      startHour: 14,
      endHour: 16,
      colorClass: "bg-teal-500/15 border border-teal-500/20 text-teal-300",
    },
    {
      id: "t-10",
      title: "Team Retrospective",
      dayIndex: 2,
      startHour: 16.5,
      endHour: 17.5,
      colorClass: "bg-rose-500/15 border border-rose-500/20 text-rose-300",
    },

    // Wednesday
    {
      id: "t-11",
      title: "Design Review",
      dayIndex: 3,
      startHour: 9,
      endHour: 10,
      colorClass: "bg-violet-500/15 border border-violet-500/20 text-violet-300",
    },
    {
      id: "t-12",
      title: "Database Optimization",
      dayIndex: 3,
      startHour: 10.5,
      endHour: 12.5,
      colorClass: "bg-amber-500/15 border border-amber-500/20 text-amber-300",
    },
    {
      id: "t-13",
      title: "Client Demo Prep",
      dayIndex: 3,
      startHour: 14,
      endHour: 15,
      colorClass: "bg-sky-500/15 border border-sky-500/20 text-sky-300",
    },
    {
      id: "t-14",
      title: "Bug Fixes",
      dayIndex: 3,
      startHour: 15.5,
      endHour: 17,
      colorClass: "bg-red-500/15 border border-red-500/20 text-red-300",
    },

    // Thursday
    {
      id: "t-15",
      title: "Weekly Sync",
      dayIndex: 4,
      startHour: 9,
      endHour: 9.5,
      colorClass: "bg-blue-500/15 border border-blue-500/20 text-blue-300",
    },
    {
      id: "t-16",
      title: "Frontend Development",
      dayIndex: 4,
      startHour: 10,
      endHour: 12,
      colorClass: "bg-green-500/15 border border-green-500/20 text-green-300",
    },
    {
      id: "t-17",
      title: "Testing & QA",
      dayIndex: 4,
      startHour: 14,
      endHour: 16,
      colorClass: "bg-lime-500/15 border border-lime-500/20 text-lime-300",
    },
    {
      id: "t-18",
      title: "Documentation",
      dayIndex: 4,
      startHour: 16.5,
      endHour: 17.5,
      colorClass: "bg-slate-500/15 border border-slate-500/20 text-slate-300",
    },

    // Friday
    {
      id: "t-19",
      title: "Project Review",
      dayIndex: 5,
      startHour: 9,
      endHour: 10,
      colorClass: "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300",
    },
    {
      id: "t-20",
      title: "Final Testing",
      dayIndex: 5,
      startHour: 10.5,
      endHour: 12,
      colorClass: "bg-yellow-500/15 border border-yellow-500/20 text-yellow-300",
    },
    {
      id: "t-21",
      title: "Deployment Prep",
      dayIndex: 5,
      startHour: 14,
      endHour: 15,
      colorClass: "bg-orange-500/15 border border-orange-500/20 text-orange-300",
    },
    {
      id: "t-22",
      title: "Week Wrap-up",
      dayIndex: 5,
      startHour: 15.5,
      endHour: 16.5,
      colorClass: "bg-purple-500/15 border border-purple-500/20 text-purple-300",
    },

    // Saturday (Light work)
    {
      id: "t-23",
      title: "Personal Learning",
      dayIndex: 6,
      startHour: 10,
      endHour: 11.5,
      colorClass: "bg-indigo-500/15 border border-indigo-500/20 text-indigo-300",
    },
    {
      id: "t-24",
      title: "Side Project",
      dayIndex: 6,
      startHour: 14,
      endHour: 16,
      colorClass: "bg-cyan-500/15 border border-cyan-500/20 text-cyan-300",
    },

    // Sunday (Planning)
    {
      id: "t-25",
      title: "Week Planning",
      dayIndex: 0,
      startHour: 10,
      endHour: 11,
      colorClass: "bg-pink-500/15 border border-pink-500/20 text-pink-300",
    },
    {
      id: "t-26",
      title: "Goal Setting",
      dayIndex: 0,
      startHour: 15,
      endHour: 16,
      colorClass: "bg-rose-500/15 border border-rose-500/20 text-rose-300",
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
            <div className="grid gap-1" style={{ gridTemplateColumns: "80px repeat(7, minmax(180px, 1fr))" }}>
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


