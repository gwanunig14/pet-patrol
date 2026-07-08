import OwnerView from "@/app/OwnerPage";
import { getBookingsByUser } from "@/api/bookings";
import { useAuth } from "@/context/auth-context";
import { render, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";

jest.mock("@/api/bookings", () => ({ getBookingsByUser: jest.fn() }));
jest.mock("@/context/auth-context", () => ({ useAuth: jest.fn() }));
jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("@/components/appointmentView", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, null, "appointments");
});
jest.mock("@/components/bookingFormView", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, null, "booking-form");
});
jest.mock("@/components/headerView", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, null, "header");
});

describe("OwnerPage", () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace });
    (getBookingsByUser as jest.Mock).mockResolvedValue([]);
  });

  test("redirects to login when user is missing", async () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    await render(<OwnerView />);
    expect(replace).toHaveBeenCalledWith("/");
  });

  test("renders views and fetches user bookings", async () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { name: "owner" } });
    const view = await render(<OwnerView />);

    expect(view.getByText("header")).toBeTruthy();
    expect(view.getByText("appointments")).toBeTruthy();
    expect(view.getByText("booking-form")).toBeTruthy();

    await waitFor(() => {
      expect(getBookingsByUser).toHaveBeenCalledWith("owner");
    });
  });
});
