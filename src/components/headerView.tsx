import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HeaderView() {
  const { currentUser, setCurrentUser } = useAuth();

  const logOut = () => {
    setCurrentUser(null);
    router.replace("/");
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{currentUser?.name}</Text>
      <Pressable style={styles.logout} onPress={logOut}>
        <Text style={styles.logoutTitle}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
    position: "relative",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 56,
    color: "green",
  },
  logout: {
    position: "absolute",
    right: 16,
  },
  logoutTitle: {
    fontSize: 20,
    color: "white",
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
  },
});
