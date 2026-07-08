import HeaderView from "@/components/headerView";
import { useAuth } from "@/context/auth-context";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";

jest.mock("@/context/auth-context", () => ({ useAuth: jest.fn() }));
jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

describe("HeaderView", () => {
  test("logs out current user", async () => {
    const setCurrentUser = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { name: "owner" },
      setCurrentUser,
    });

    const view = await render(<HeaderView />);

    expect(view.getByText("owner")).toBeTruthy();
    fireEvent.press(view.getByText("Log Out"));
    expect(setCurrentUser).toHaveBeenCalledWith(null);
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
