import BookingBlock from "@/components/bookingBlock";
import { render } from "@testing-library/react-native";

describe("BookingBlock", () => {
  test("renders booking summary", async () => {
    const selectedDate = new Date(2026, 0, 2, 0, 0, 0);
    const startTime = new Date(2026, 0, 2, 10, 0, 0);
    const endTime = new Date(2026, 0, 2, 12, 0, 0);

    const view = await render(
      <BookingBlock
        booking={{
          id: "1",
          owner: "owner",
          petName: "Nugget",
          date: selectedDate,
          startTime,
          endTime,
          status: "Pending",
          animal: "dog",
          price: 40,
        }}
        selectedDate={selectedDate}
        index={0}
      />,
    );

    expect(view.getByText("Nugget")).toBeTruthy();
    expect(view.getByText("Dog")).toBeTruthy();
    expect(view.getByText("$40")).toBeTruthy();
  });
});
