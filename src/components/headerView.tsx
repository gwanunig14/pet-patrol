import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ChevronDownIcon, LogoutIcon, ShieldPawIcon, UserIcon } from "./art";

const HEADER_MAX_WIDTH = 1440;

export default function HeaderView() {
  const { currentUser, setCurrentUser } = useAuth();
  const { width } = useWindowDimensions();
  const compact = width < 620;
  const veryCompact = width < 430;

  const logOut = () => {
    setCurrentUser(null);
    router.replace("/");
  };

  return (
    <View style={styles.header}>
      <View style={[styles.headerInner, compact && styles.headerInnerCompact]}>
        <View style={styles.brand}>
          <ShieldPawIcon size={compact ? 30 : 36} />
          <Text style={[styles.brandTitle, compact && styles.brandTitleCompact]}>
            Pet Patrol
          </Text>
        </View>

        <View style={[styles.actions, compact && styles.actionsCompact]}>
          {currentUser ? (
            <View style={[styles.userArea, veryCompact && styles.userAreaCompact]}>
              <UserIcon size={compact ? 20 : 22} color="#4d5754" />
              {!veryCompact ? (
                <>
                  <Text numberOfLines={1} style={styles.userName}>
                    {currentUser.name}
                  </Text>
                  <ChevronDownIcon size={14} color="#4d5754" />
                </>
              ) : null}
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={logOut}
            style={({ pressed }) => [
              styles.logout,
              compact && styles.logoutCompact,
              pressed && styles.logoutPressed,
            ]}
          >
            <LogoutIcon size={18} />
            {!veryCompact ? (
              <Text style={styles.logoutTitle}>Log Out</Text>
            ) : null}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8df",
    shadowColor: "#182d1b",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 2,
    zIndex: 10,
  },
  headerInner: {
    width: "100%",
    maxWidth: HEADER_MAX_WIDTH,
    minHeight: 82,
    alignSelf: "center",
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInnerCompact: {
    minHeight: 70,
    paddingHorizontal: 16,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandTitle: {
    color: "#14731f",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
  },
  brandTitleCompact: {
    fontSize: 21,
    lineHeight: 27,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionsCompact: {
    gap: 9,
  },
  userArea: {
    maxWidth: 210,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  userAreaCompact: {
    paddingVertical: 7,
  },
  userName: {
    maxWidth: 145,
    color: "#26312d",
    fontSize: 14,
    fontWeight: "600",
  },
  logout: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#65ae68",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutCompact: {
    minWidth: 42,
    minHeight: 40,
    paddingHorizontal: 10,
  },
  logoutPressed: {
    opacity: 0.68,
    backgroundColor: "#f2f9f1",
  },
  logoutTitle: {
    color: "#146f1f",
    fontSize: 14,
    fontWeight: "700",
  },
});
