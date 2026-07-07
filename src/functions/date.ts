export const HOUR_MS = 60 * 60 * 1000;
export const DAY_MS = 24 * HOUR_MS;
export const TIME_OPTIONS = Array.from(
  { length: 48 },
  (_, index) => index * 30,
);
export const LENGTH_OPTIONS = Array.from(
  { length: 7 },
  (_, index) => index + 2,
);

export type DateOption = {
  key: string;
  date: Date;
  label: string;
};

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function atStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function combineDateAndMinute(date: Date, minuteOfDay: number): Date {
  const result = atStartOfDay(date);
  result.setMinutes(minuteOfDay);
  return result;
}

export function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTimeLabel(minuteOfDay: number): string {
  const hours24 = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}
