process.env.EXPO_PUBLIC_API_URL = "http://localhost:3001";

global.fetch = jest.fn();

jest.mock("@react-native-picker/picker", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  function Picker({ children }: { children: React.ReactNode }) {
    return React.createElement(View, null, children);
  }

  Picker.Item = function PickerItem({
    label,
  }: {
    label: string;
    value: string | number;
  }) {
    return React.createElement(Text, null, label);
  };

  return { Picker };
});
