import { getUser, User } from "@/api/user";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";

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
        router.replace("/OwnerPage");
      } else {
        router.replace("/SitterPage");
      }
    } catch (err) {
      setCurrentUser(null);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Pet Patrol</Text>
      <TextInput
        style={styles.loginFields}
        placeholder="Username"
        onChangeText={(t) => setName(t)}
      />
      <TextInput
        style={styles.loginFields}
        placeholder="Password"
        onChangeText={(t) => setPassword(t)}
      />
      <Pressable style={styles.button} onPress={logIn}>
        <Text style={styles.buttonTitle}>Log In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 64,
    alignSelf: "center",
    margin: 16,
    color: "green",
  },
  loginFields: {
    alignSelf: "center",
    margin: 8,
    width: 400,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    fontSize: 20,
  },
  button: {
    alignSelf: "center",
    margin: 16,
    backgroundColor: "green",
    width: 400,
    padding: 16,
    borderRadius: 8,
  },
  buttonTitle: {
    alignSelf: "center",
    fontSize: 20,
    color: "white",
  },
});
