import { AuthProvider, useAuth } from "@/context/auth-context";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

function Consumer() {
  const { currentUser, setCurrentUser } = useAuth();

  return (
    <>
      <Text>{currentUser?.name ?? "none"}</Text>
      <Pressable
        onPress={() => setCurrentUser({ name: "owner", password: "pw" })}
      >
        <Text>set-user</Text>
      </Pressable>
    </>
  );
}

describe("auth context", () => {
  test("throws when useAuth is called outside provider", async () => {
    await expect(render(<Consumer />)).rejects.toThrow(
      "useAuth must be used inside AuthProvider",
    );
  });

  test("provides and updates auth state", async () => {
    const view = await render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(view.getByText("none")).toBeTruthy();
    await fireEvent.press(view.getByText("set-user"));
    await waitFor(() => {
      expect(view.getByText("owner")).toBeTruthy();
    });
  });
});
