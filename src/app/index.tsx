import { getUser, type User } from "@/api/user";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  PawIcon,
  ShieldPawIcon,
  TrioIllustration,
  UserIcon,
} from "@/components/art";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

const GREEN = "#0b8618";
const GREEN_DARK = "#10641d";
const TEXT = "#151b24";
const MUTED = "#667079";
const FIELD_BORDER = "#cfd8d1";
const PAGE_BACKGROUND = "#fbfcfa";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCurrentUser } = useAuth();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const isWide = width >= 900;
  const isSmallPhone = width < 390;

  const logIn = async () => {
    if (!name.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const newUser: User = { name: name.trim(), password };
      const fetchedUser = await getUser(newUser);

      setCurrentUser(fetchedUser);
      router.replace(
        fetchedUser.name === "sitter" ? "/SitterPage" : "/OwnerPage",
      );
    } catch {
      setCurrentUser(null);
      setError("That username or password was not recognized.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          isWide ? styles.scrollContentWide : styles.scrollContentMobile,
          !isWide && height < 760 && styles.scrollContentShort,
        ]}
      >
        <View pointerEvents="none" style={styles.backgroundDecorations}>
          <View
            style={[
              styles.backgroundPaw,
              isWide ? styles.webPawTopRight : styles.mobilePawTopLeft,
            ]}
          >
            <PawIcon size={isWide ? 56 : 68} color="#e2eee0" />
          </View>

          <View
            style={[
              styles.backgroundPaw,
              isWide ? styles.webPawBottomRight : styles.mobilePawBottomLeft,
            ]}
          >
            <PawIcon size={isWide ? 68 : 62} color="#e6f0e3" />
          </View>

          {!isWide && (
            <>
              <View
                style={[styles.backgroundPaw, styles.mobilePawBottomMiddle]}
              >
                <PawIcon size={54} color="#e6f0e3" />
              </View>
              <View style={[styles.backgroundPaw, styles.mobilePawBottomRight]}>
                <PawIcon size={46} color="#e6f0e3" />
              </View>
            </>
          )}
        </View>

        {isWide ? (
          <View style={styles.desktopPage}>
            <View style={styles.desktopBrand}>
              <ShieldPawIcon size={42} />
              <Text style={styles.desktopBrandText}>Pet Patrol</Text>
            </View>

            <View style={styles.desktopBody}>
              <View style={styles.heroPanel}>
                <View>
                  <Text style={styles.heroTitle}>
                    Peace of mind{"\n"}for your pets.
                  </Text>
                  <Text style={styles.heroCopy}>
                    Trusted care when you’re away.{"\n"}
                    Happy pets, happy homes.
                  </Text>
                </View>

                <View style={styles.desktopIllustration}>
                  <TrioIllustration width={500} height={300} />
                </View>
              </View>

              <View style={styles.desktopLoginColumn}>
                <LoginCard
                  name={name}
                  password={password}
                  hidePassword={hidePassword}
                  isSubmitting={isSubmitting}
                  error={error}
                  setName={setName}
                  setPassword={setPassword}
                  togglePassword={() => setHidePassword((value) => !value)}
                  onSubmit={logIn}
                  compact={false}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.mobilePage}>
            <View style={styles.mobileIllustration}>
              <TrioIllustration
                width={isSmallPhone ? 300 : 350}
                height={isSmallPhone ? 170 : 200}
              />
            </View>

            <View style={styles.mobileCardOverlap}>
              <LoginCard
                name={name}
                password={password}
                hidePassword={hidePassword}
                isSubmitting={isSubmitting}
                error={error}
                setName={setName}
                setPassword={setPassword}
                togglePassword={() => setHidePassword((value) => !value)}
                onSubmit={logIn}
                compact
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type LoginCardProps = {
  name: string;
  password: string;
  hidePassword: boolean;
  isSubmitting: boolean;
  error: string | null;
  setName: (value: string) => void;
  setPassword: (value: string) => void;
  togglePassword: () => void;
  onSubmit: () => void;
  compact: boolean;
};

function LoginCard({
  name,
  password,
  hidePassword,
  isSubmitting,
  error,
  setName,
  setPassword,
  togglePassword,
  onSubmit,
  compact,
}: LoginCardProps) {
  return (
    <View style={[styles.loginCard, compact && styles.loginCardMobile]}>
      <View style={styles.cardBrandRow}>
        <ShieldPawIcon size={compact ? 54 : 58} />
        <Text
          style={[styles.cardBrandText, compact && styles.cardBrandTextMobile]}
        >
          Pet Patrol
        </Text>
      </View>

      <Text style={[styles.welcomeText, compact && styles.welcomeTextMobile]}>
        Welcome back! Please log in to your account.
      </Text>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Username</Text>
        <View style={styles.fieldShell}>
          <UserIcon size={compact ? 22 : 19} color={GREEN} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            placeholder="Enter your username"
            placeholderTextColor="#90979f"
            returnKeyType="next"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Password</Text>
        <View style={styles.fieldShell}>
          <LockIcon size={compact ? 22 : 19} color={GREEN} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            placeholder="Enter your password"
            placeholderTextColor="#90979f"
            returnKeyType="go"
            secureTextEntry={hidePassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={() => onSubmit()}
          />
          <Pressable
            accessibilityLabel={
              hidePassword ? "Show password" : "Hide password"
            }
            hitSlop={10}
            onPress={togglePassword}
            style={styles.eyeButton}
          >
            {hidePassword ? (
              <EyeIcon size={compact ? 25 : 20} color={GREEN} />
            ) : (
              <EyeOffIcon size={compact ? 25 : 20} color={GREEN} />
            )}
          </Pressable>
        </View>
      </View>

      <Pressable
        disabled={isSubmitting}
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.loginButton,
          pressed && !isSubmitting && styles.loginButtonPressed,
          isSubmitting && styles.loginButtonDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </Pressable>

      {!compact && (
        <View style={styles.securityNote}>
          <ShieldPawIcon size={16} />
          <Text style={styles.securityText}>
            Your information is secure and only shared with approved sitters.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    position: "relative",
    overflow: "hidden",
  },
  scrollContentWide: {
    minHeight: 720,
  },
  scrollContentMobile: {
    minHeight: "100%",
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 48,
    justifyContent: "center",
  },
  scrollContentShort: {
    justifyContent: "flex-start",
  },
  backgroundDecorations: {
    ...StyleSheet.absoluteFill,
  },
  backgroundPaw: {
    position: "absolute",
    opacity: 0.9,
  },
  webPawTopRight: {
    right: 52,
    top: 36,
    transform: [{ rotate: "12deg" }],
  },
  webPawBottomRight: {
    right: 34,
    bottom: 22,
    transform: [{ rotate: "-14deg" }],
  },
  mobilePawTopLeft: {
    left: 46,
    top: 114,
    transform: [{ rotate: "-12deg" }],
  },
  mobilePawBottomLeft: {
    left: "42%",
    bottom: 30,
    transform: [{ rotate: "-24deg" }],
  },
  mobilePawBottomMiddle: {
    left: "61%",
    bottom: 72,
    transform: [{ rotate: "-10deg" }],
  },
  mobilePawBottomRight: {
    right: 42,
    bottom: 104,
    transform: [{ rotate: "12deg" }],
  },
  desktopPage: {
    flex: 1,
    minHeight: 720,
    paddingHorizontal: 42,
    paddingVertical: 32,
  },
  desktopBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  desktopBrandText: {
    color: GREEN,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.7,
  },
  desktopBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 72,
    width: "100%",
    maxWidth: 1440,
    alignSelf: "center",
    paddingTop: 22,
  },
  heroPanel: {
    flex: 1,
    minWidth: 380,
    maxWidth: 540,
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingTop: 70,
  },
  heroTitle: {
    maxWidth: 460,
    color: TEXT,
    fontSize: 50,
    lineHeight: 56,
    fontWeight: "700",
    letterSpacing: -1.3,
  },
  heroCopy: {
    marginTop: 24,
    color: MUTED,
    fontSize: 19,
    lineHeight: 29,
  },
  desktopIllustration: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    minHeight: 300,
    marginLeft: -12,
  },
  desktopLoginColumn: {
    flex: 1,
    minWidth: 470,
    maxWidth: 620,
    alignItems: "center",
    justifyContent: "center",
  },
  mobilePage: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "center",
    paddingTop: 12,
  },
  mobileIllustration: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: -26,
  },
  mobileCardOverlap: {
    zIndex: 2,
    width: "100%",
  },
  loginCard: {
    width: "100%",
    maxWidth: 580,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "#e0e5df",
    borderRadius: 18,
    paddingHorizontal: 46,
    paddingTop: 48,
    paddingBottom: 38,
    shadowColor: "#8d978d",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 7,
  },
  loginCardMobile: {
    maxWidth: 500,
    borderRadius: 26,
    paddingHorizontal: 28,
    paddingTop: 42,
    paddingBottom: 34,
  },
  cardBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  cardBrandText: {
    color: GREEN,
    fontSize: 43,
    lineHeight: 50,
    fontWeight: "700",
    letterSpacing: -1.2,
  },
  cardBrandTextMobile: {
    fontSize: 38,
    lineHeight: 46,
  },
  welcomeText: {
    marginTop: 22,
    marginBottom: 34,
    color: MUTED,
    textAlign: "center",
    fontSize: 17,
    lineHeight: 23,
  },
  welcomeTextMobile: {
    marginTop: 18,
    marginBottom: 34,
    fontSize: 16,
  },
  errorBanner: {
    marginTop: -18,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#efc7c7",
    backgroundColor: "#fff4f4",
  },
  errorText: {
    color: "#b4232d",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
  fieldGroup: {
    width: "100%",
    marginBottom: 24,
  },
  fieldLabel: {
    marginBottom: 10,
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },
  fieldShell: {
    width: "100%",
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    paddingVertical: 0,
    color: TEXT,
    fontSize: 16,
  },
  eyeButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    width: "100%",
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: GREEN,
    shadowColor: GREEN_DARK,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  loginButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.997 }],
  },
  loginButtonDisabled: {
    opacity: 0.68,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  securityText: {
    flexShrink: 1,
    color: "#737c83",
    fontSize: 12,
    lineHeight: 17,
  },
});
