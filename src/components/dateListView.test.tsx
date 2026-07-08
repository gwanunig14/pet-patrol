import DateListView from "@/components/dateListView";
import { fireEvent, render } from "@testing-library/react-native";

describe("DateListView", () => {
  test("selects date when pressed", async () => {
    const date = new Date("2026-01-02T00:00:00.000Z");
    const setSelectedDate = jest.fn();

    const view = await render(
      <DateListView
        dateOptions={[{ key: "2026-01-02", date, label: "Fri, Jan 2" }]}
        setSelectedDate={setSelectedDate}
      />,
    );

    fireEvent.press(view.getByText(/Jan/i));
    expect(setSelectedDate).toHaveBeenCalledWith(date);
  });
});
