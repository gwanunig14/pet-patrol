import PendingBookingsView from "@/components/pendingBookingsView";
import { updateBookingStatus } from "@/api/bookings";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@/api/bookings", () => ({ updateBookingStatus: jest.fn() }));

describe("PendingBookingsView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (updateBookingStatus as jest.Mock).mockImplementation(
      async (id, status) => ({
        id,
        owner: "owner",
        petName: "Nugget",
        date: "2026-01-02T00:00:00.000Z",
        startTime: "2026-01-02T10:00:00.000Z",
        endTime: "2026-01-02T11:00:00.000Z",
        status,
        animal: "dog",
        price: 20,
      }),
    );
  });

  test("filters to pending bookings and supports interactions", async () => {
    const setBookings = jest.fn();
    const setSelectedDate = jest.fn();

    const view = await render(
      <PendingBookingsView
        bookings={[
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
          {
            id: "2",
            owner: "owner",
            petName: "Skip",
            date: "2026-01-02T00:00:00.000Z",
            startTime: "2026-01-02T10:00:00.000Z",
            endTime: "2026-01-02T11:00:00.000Z",
            status: "Accepted",
            animal: "cat",
            price: 20,
          },
        ]}
        setBookings={setBookings}
        setSelectedDate={setSelectedDate}
      />,
    );

    expect(view.getByText("Nugget")).toBeTruthy();
    expect(view.queryByText("Skip")).toBeNull();

    await fireEvent.press(view.getByText("View Date"));
    expect(setSelectedDate).toHaveBeenCalled();

    await fireEvent.press(view.getByText("Accept"));
    await waitFor(() => {
      expect(updateBookingStatus).toHaveBeenCalledWith("1", "Accepted");
      expect(setBookings).toHaveBeenCalled();
    });
  });
});
