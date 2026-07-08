import {
  atStartOfDay,
  combineDateAndMinute,
  DAY_MS,
  formatDateLabel,
  formatTimeLabel,
  HOUR_MS,
  LENGTH_OPTIONS,
  TIME_OPTIONS,
  toDateKey,
} from "@/functions/date";

describe("date utilities", () => {
  test("exposes expected constants", () => {
    expect(HOUR_MS).toBe(60 * 60 * 1000);
    expect(DAY_MS).toBe(24 * HOUR_MS);
    expect(TIME_OPTIONS).toHaveLength(48);
    expect(TIME_OPTIONS[0]).toBe(0);
    expect(TIME_OPTIONS[47]).toBe(1410);
    expect(LENGTH_OPTIONS).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });

  test("formats and normalizes date values", () => {
    const date = new Date("2026-03-14T16:45:00.000Z");
    expect(toDateKey(date)).toBe("2026-03-14");

    const start = atStartOfDay(date);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);

    const combined = combineDateAndMinute(date, 90);
    expect(combined.getHours()).toBe(1);
    expect(combined.getMinutes()).toBe(30);
  });

  test("formats labels", () => {
    expect(formatDateLabel(new Date("2026-03-14T00:00:00.000Z"))).toContain(
      "Mar",
    );
    expect(formatTimeLabel(0)).toBe("12:00 AM");
    expect(formatTimeLabel(720)).toBe("12:00 PM");
    expect(formatTimeLabel(870)).toBe("2:30 PM");
  });
});
