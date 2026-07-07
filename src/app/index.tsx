import { getUser, User } from "@/api/user";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useAuth();
  const router = useRouter();

  const logIn = async () => {
    try {
      const newUser: User = { name: name, password };
      const fetchedUser = await getUser(newUser);

      setCurrentUser(fetchedUser);

      if (fetchedUser.name !== "sitter") {
        router.replace("/OwnerView");
      }
    } catch (err) {
      setCurrentUser(null);
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={(t) => setName(t)} />
      <TextInput placeholder="Password" onChangeText={(t) => setPassword(t)} />
      <Button title="Log In" onPress={logIn} />
    </View>
  );
}

const styles = StyleSheet.create({});
