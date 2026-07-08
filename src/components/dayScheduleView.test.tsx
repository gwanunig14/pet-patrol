import DayScheduleView from "@/components/dayScheduleView";
import { render } from "@testing-library/react-native";

jest.mock("@/components/bookingBlock", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, null, "booking-block");
});

describe("DayScheduleView", () => {
  test("renders selected date, hour rows, and booking blocks", async () => {
    const view = await render(
      <DayScheduleView
        selectedDate={new Date("2026-01-02T00:00:00.000Z")}
        dateBookings={[
          {
            id: "1",
            owner: "owner",
            petName: "Nugget",
            date: new Date("2026-01-02T00:00:00.000Z"),
            startTime: new Date("2026-01-02T10:00:00.000Z"),
            endTime: new Date("2026-01-02T11:00:00.000Z"),
            status: "Pending",
            animal: "dog",
            price: 20,
          },
        ]}
      />,
    );

    expect(view.getByText(/Jan/i)).toBeTruthy();
    expect(view.getByText("12 AM")).toBeTruthy();
    expect(view.getByText("11 PM")).toBeTruthy();
    expect(view.getByText("booking-block")).toBeTruthy();
  });
});
