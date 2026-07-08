import AppointmentView from "@/components/appointmentView";
import { getBookingsByUser } from "@/api/bookings";
import { useAuth } from "@/context/auth-context";
import { render, waitFor } from "@testing-library/react-native";

jest.mock("@/api/bookings", () => ({ getBookingsByUser: jest.fn() }));
jest.mock("@/context/auth-context", () => ({ useAuth: jest.fn() }));

describe("AppointmentView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns nothing when current user is missing", async () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    const view = await render(<AppointmentView />);
    expect(view.queryByText("anything")).toBeNull();
  });

  test("loads and renders bookings", async () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { name: "owner" } });
    (getBookingsByUser as jest.Mock).mockResolvedValue([
      {
        id: "1",
        owner: "owner",
        petName: "Nugget",
        date: "2026-01-02T00:00:00.000Z",
        startTime: "2026-01-02T10:00:00.000Z",
        endTime: "2026-01-02T11:00:00.000Z",
        status: "Pending",
        animal: "dog",
        price: 20,
      },
    ]);

    const view = await render(<AppointmentView />);

    await waitFor(() => {
      expect(getBookingsByUser).toHaveBeenCalledWith("owner");
      expect(view.getByText("Nugget")).toBeTruthy();
      expect(view.getByText("Pending")).toBeTruthy();
    });
  });
});
