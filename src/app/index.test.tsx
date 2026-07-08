import HomeScreen from "@/app/index";
import { getUser } from "@/api/user";
import { useAuth } from "@/context/auth-context";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";

jest.mock("@/api/user", () => ({ getUser: jest.fn() }));
jest.mock("@/context/auth-context", () => ({ useAuth: jest.fn() }));
jest.mock("expo-router", () => ({ useRouter: jest.fn() }));

describe("HomeScreen", () => {
  const replace = jest.fn();
  const setCurrentUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace });
    (useAuth as jest.Mock).mockReturnValue({ setCurrentUser });
  });

  test("routes owner users to OwnerPage", async () => {
    (getUser as jest.Mock).mockResolvedValue({ name: "owner", password: "pw" });
    const view = await render(<HomeScreen />);

    await fireEvent.changeText(view.getByPlaceholderText("Username"), "owner");
    await fireEvent.changeText(view.getByPlaceholderText("Password"), "pw");
    await fireEvent.press(view.getByText("Log In"));

    await waitFor(() => {
      expect(setCurrentUser).toHaveBeenCalledWith({
        name: "owner",
        password: "pw",
      });
      expect(replace).toHaveBeenCalledWith("/OwnerPage");
    });
  });

  test("routes sitter users to SitterPage", async () => {
    (getUser as jest.Mock).mockResolvedValue({
      name: "sitter",
      password: "pw",
    });
    const view = await render(<HomeScreen />);

    await fireEvent.changeText(view.getByPlaceholderText("Username"), "sitter");
    await fireEvent.changeText(view.getByPlaceholderText("Password"), "pw");
    await fireEvent.press(view.getByText("Log In"));

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/SitterPage");
    });
  });

  test("clears user on login failure", async () => {
    (getUser as jest.Mock).mockRejectedValue(new Error("bad login"));
    const view = await render(<HomeScreen />);

    await fireEvent.press(view.getByText("Log In"));

    await waitFor(() => {
      expect(setCurrentUser).toHaveBeenCalledWith(null);
    });
  });
});
