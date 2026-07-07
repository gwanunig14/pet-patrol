import { getUser, User } from "@/api/user";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const logIn = async () => {
    const newUser: User = { name: name, password };
    const fetchedUser = await getUser(newUser);
    if (fetchedUser.name) setUser(fetchedUser);
  };

  return (
    <View>
      <Text>{user?.name ?? ""}</Text>
      <TextInput placeholder="Username" onChangeText={(t) => setName(t)} />
      <TextInput placeholder="Password" onChangeText={(t) => setPassword(t)} />
      <Button title="Log In" onPress={logIn} />
    </View>
  );
}

const styles = StyleSheet.create({});
