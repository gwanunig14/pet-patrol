import BookingBlock from "@/components/bookingBlock";
import { render } from "@testing-library/react-native";

describe("BookingBlock", () => {
  test("renders booking summary", async () => {
    const view = await render(
      <BookingBlock
        booking={{
          id: "1",
          owner: "owner",
          petName: "Nugget",
          date: new Date("2026-01-02T00:00:00.000Z"),
          startTime: new Date("2026-01-02T10:00:00.000Z"),
          endTime: new Date("2026-01-02T12:00:00.000Z"),
          status: "Pending",
          animal: "dog",
          price: 40,
        }}
        selectedDate={new Date("2026-01-02T00:00:00.000Z")}
        index={0}
      />,
    );

    expect(view.getByText("Nugget")).toBeTruthy();
    expect(view.getByText("Dog")).toBeTruthy();
    expect(view.getByText("$40")).toBeTruthy();
  });
});
