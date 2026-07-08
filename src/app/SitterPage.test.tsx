import SitterPage from "@/app/SitterPage";
import { getBookings } from "@/api/bookings";
import { render, waitFor } from "@testing-library/react-native";

jest.mock("@/api/bookings", () => ({
  getBookings: jest.fn(),
  updateBookingStatus: jest.fn(),
}));

const mockPendingSpy = jest.fn();

jest.mock("@/components/headerView", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, null, "header");
});
jest.mock("@/components/dateListView", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, null, "date-list");
});
jest.mock("@/components/dayScheduleView", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, null, "day-schedule");
});
jest.mock("@/components/pendingBookingsView", () => (props: any) => {
  const React = require("react");
  const { Text } = require("react-native");
  mockPendingSpy(props);
  return React.createElement(Text, null, "pending-bookings");
});

describe("SitterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getBookings as jest.Mock).mockResolvedValue([
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
  });

  test("loads bookings and renders sections", async () => {
    const view = await render(<SitterPage />);

    expect(view.getByText("header")).toBeTruthy();
    expect(view.getByText("date-list")).toBeTruthy();

    await waitFor(() => {
      expect(getBookings).toHaveBeenCalled();
      expect(view.getByText("day-schedule")).toBeTruthy();
      expect(view.getByText("pending-bookings")).toBeTruthy();
      expect(mockPendingSpy).toHaveBeenCalled();
    });
  });
});
