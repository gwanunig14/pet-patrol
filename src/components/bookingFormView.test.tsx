import BookingForm, { capitalize } from "@/components/bookingFormView";
import { createBooking } from "@/api/bookings";
import { getPrices } from "@/api/prices";
import { useAuth } from "@/context/auth-context";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@/api/bookings", () => ({
  Animals: ["pig", "dog", "cat"],
  createBooking: jest.fn(),
}));
jest.mock("@/api/prices", () => ({ getPrices: jest.fn() }));
jest.mock("@/context/auth-context", () => ({ useAuth: jest.fn() }));

describe("BookingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { name: "owner" } });
    (getPrices as jest.Mock).mockResolvedValue({ pig: 15, dog: 10, cat: 5 });
    (createBooking as jest.Mock).mockResolvedValue({ id: "1" });
  });

  test("capitalizes strings", () => {
    expect(capitalize("dog")).toBe("Dog");
  });

  test("renders nothing without authenticated user", async () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    const view = await render(<BookingForm />);
    expect(view.queryByText("Submit Sitter Request")).toBeNull();
  });

  test("shows validation error when pet name is missing", async () => {
    const view = await render(<BookingForm />);

    await fireEvent.press(view.getByText("Submit Sitter Request"));
    await waitFor(() => {
      expect(view.getByText("No Name")).toBeTruthy();
    });
  });

  test("submits booking with defaults", async () => {
    const view = await render(<BookingForm />);

    await fireEvent.changeText(view.getByPlaceholderText("Pet Name"), "Nugget");
    await fireEvent.press(view.getByText("Submit Sitter Request"));

    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: "owner",
          petName: "Nugget",
          animal: "dog",
          status: "Pending",
        }),
      );
    });
  });
});
