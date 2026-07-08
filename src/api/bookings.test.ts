import {
  createBooking,
  getBookings,
  getBookingsByUser,
  updateBookingStatus,
} from "@/api/bookings";

describe("bookings api", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-02T10:00:00.000Z"));
    (global.fetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("gets future bookings", async () => {
    const expected = [{ id: "1" }];
    const start = new Date("2026-01-02T10:00:00.000Z");
    start.setHours(0, 0, 0, 0);
    const encodedStart = encodeURIComponent(start.toISOString());

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => expected,
    });

    const bookings = await getBookings();

    expect(bookings).toEqual(expected);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/bookings?startTime_gte=${encodedStart}`,
    );
  });

  test("gets bookings by user", async () => {
    const start = new Date("2026-01-02T10:00:00.000Z");
    start.setHours(0, 0, 0, 0);
    const encodedStart = encodeURIComponent(start.toISOString());

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await getBookingsByUser("owner 1");

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/bookings?owner=owner%201&startTime_gte=${encodedStart}`,
    );
  });

  test("throws if username is missing", async () => {
    await expect(getBookingsByUser("")).rejects.toThrow("No username provided");
  });

  test("creates booking", async () => {
    const payload = {
      owner: "owner",
      petName: "Nugget",
      date: new Date("2026-01-03T00:00:00.000Z"),
      startTime: new Date("2026-01-03T09:00:00.000Z"),
      endTime: new Date("2026-01-03T11:00:00.000Z"),
      status: "Pending" as const,
      animal: "dog" as const,
      price: 20,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", ...payload }),
    });

    await createBooking(payload);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/bookings",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  test("updates booking status", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", status: "Accepted" }),
    });

    await updateBookingStatus("1", "Accepted");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/bookings/1",
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Accepted" }),
      }),
    );
  });

  test("throws on non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
    await expect(getBookings()).rejects.toThrow("Booking request failed: 500");
  });
});
