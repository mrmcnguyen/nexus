export type PlannerTask = {
  id: string;
  title: string;
  description?: string;
  dayIndex: number; // 0-6 (Sun-Sat)
  startHour: number; // 0-23
  endHour: number; // 1-24 (exclusive)
  colorClass?: string; // Tailwind color class for accent
};

export const HOURS: number[] = Array.from({ length: 18 }, (_, i) => i + 6); // 6 -> 23
export const DAYS: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday as start
  const res = new Date(d.setDate(diff));
  res.setHours(0, 0, 0, 0);
  return res;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatMD(date: Date): string {
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${m}/${d}`;
}


