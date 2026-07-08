import TabLayout from "@/app/_layout";
import { render } from "@testing-library/react-native";
import * as ReactNative from "react-native";

const mockThemeProviderSpy = jest.fn();

jest.mock("expo-router", () => ({
  DarkTheme: { dark: true },
  DefaultTheme: { dark: false },
  Slot: () => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, "slot");
  },
  ThemeProvider: ({ value, children }: any) => {
    const React = require("react");
    mockThemeProviderSpy(value);
    return React.createElement(React.Fragment, null, children);
  },
}));

jest.mock("@/context/auth-context", () => ({
  AuthProvider: ({ children }: any) => {
    const React = require("react");
    return React.createElement(React.Fragment, null, children);
  },
}));

describe("app layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uses dark theme when color scheme is dark", async () => {
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");
    const view = await render(<TabLayout />);

    expect(view.getByText("slot")).toBeTruthy();
    expect(mockThemeProviderSpy).toHaveBeenCalledWith({ dark: true });
  });
});
