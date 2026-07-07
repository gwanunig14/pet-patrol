import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

export default function HomeScreen() {
  const [username, setUsername] = useState("");

  return (
    <div>
      <TextInput placeholder="Username" onChangeText={(t) => setUsername(t)} />
      <Button title="Log In" />
    </div>
  );
}

const styles = StyleSheet.create({});
