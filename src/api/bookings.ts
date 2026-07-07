const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

export const Animals = ["pig", "dog", "cat"] as const;
export const Statuses = ["Pending", "Accepted", "Declined"];

export interface Booking {
  id: string;
  owner: string;
  petName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: (typeof Statuses)[number];
  animal: (typeof Animals)[number];
  price: number;
}

export type CreateBookingInput = Omit<Booking, "id">;

function getTodayIsoStart(): string {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  return startOfToday.toISOString();
}

export async function getBookings(): Promise<Booking[]> {
  const response = await fetch(
    `${API_URL}/bookings?startTime_gte=${encodeURIComponent(getTodayIsoStart())}`,
  );

  if (!response.ok) {
    throw new Error(`Booking request failed: ${response.status}`);
  }

  return response.json();
}

export async function getBookingsByUser(username: string): Promise<Booking[]> {
  if (!username) {
    throw new Error("No username provided");
  }

  const todayIsoStart = getTodayIsoStart();
  const response = await fetch(
    `${API_URL}/bookings?owner=${encodeURIComponent(username)}&startTime_gte=${encodeURIComponent(todayIsoStart)}`,
  );

  if (!response.ok) {
    throw new Error(`Booking request failed: ${response.status}`);
  }

  return response.json();
}

export async function createBooking(
  newBooking: CreateBookingInput,
): Promise<Booking> {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBooking),
  });

  if (!response.ok) {
    throw new Error(`Could not create booking: ${response.status}`);
  }

  return response.json();
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"],
): Promise<Booking> {
  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Could not update booking status: ${response.status}`);
  }

  return response.json();
}
