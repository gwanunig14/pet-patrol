import AppointmentView from "@/components/appointmentView";
import BookingForm from "@/components/bookingFormView";
import HeaderView from "@/components/headerView";
import { PawIcon, PlusIcon } from "@/components/art";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const PAGE_MAX_WIDTH = 1440;
const DESKTOP_BREAKPOINT = 1080;

export default function OwnerView() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const formScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const resetFormScroll = () => {
    formScrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.screen}>
      <HeaderView />

      <View
        style={[
          styles.page,
          isDesktop ? styles.pageDesktop : styles.pageStacked,
        ]}
      >
        <View
          style={[
            styles.requestsCard,
            isDesktop
              ? styles.requestsCardDesktop
              : styles.requestsCardMobile,
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionEyebrow}>YOUR BOOKINGS</Text>
              <Text style={styles.sectionTitle}>My Pet Requests</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={resetFormScroll}
              style={({ pressed }) => [
                styles.newRequestButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <PlusIcon size={17} />
              <Text style={styles.newRequestText}>New Request</Text>
            </Pressable>
          </View>

          {isDesktop ? (
            <ScrollView
              style={styles.requestsScroll}
              contentContainerStyle={styles.requestsScrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <AppointmentView />
            </ScrollView>
          ) : (
            <View style={styles.mobileRequests}>
              <AppointmentView horizontal />
            </View>
          )}
        </View>

        <View style={styles.formColumn}>
          <ScrollView
            ref={formScrollRef}
            style={styles.formScroll}
            contentContainerStyle={styles.formScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <BookingForm />
          </ScrollView>
        </View>
      </View>

      <View pointerEvents="none" style={styles.decorLeft}>
        <PawIcon size={72} color="#dcebd8" />
      </View>
      <View pointerEvents="none" style={styles.decorRight}>
        <PawIcon size={56} color="#dcebd8" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: "#f5f8f3",
  },
  page: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: "center",
    zIndex: 1,
  },
  pageDesktop: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 24,
  },
  pageStacked: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "column",
    gap: 12,
  },
  requestsCard: {
    minHeight: 0,
    borderWidth: 1,
    borderColor: "#dce6d9",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#18351c",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 22,
    elevation: 3,
    overflow: "hidden",
  },
  requestsCardDesktop: {
    width: 372,
    flexShrink: 0,
    padding: 18,
  },
  requestsCardMobile: {
    height: 246,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  sectionHeader: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  sectionHeading: {
    minWidth: 0,
    flexShrink: 1,
  },
  sectionEyebrow: {
    marginBottom: 3,
    color: "#38833f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  sectionTitle: {
    color: "#16202a",
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700",
  },
  newRequestButton: {
    minHeight: 40,
    flexShrink: 0,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#77bb79",
    borderRadius: 10,
    backgroundColor: "#f8fcf7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  newRequestText: {
    color: "#176f22",
    fontSize: 13,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.72,
  },
  requestsScroll: {
    flex: 1,
    minHeight: 0,
  },
  requestsScrollContent: {
    paddingBottom: 2,
  },
  mobileRequests: {
    flex: 1,
    minHeight: 0,
    justifyContent: "center",
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
  formScroll: {
    flex: 1,
    minHeight: 0,
  },
  formScrollContent: {
    flexGrow: 1,
    paddingBottom: 2,
  },
  decorLeft: {
    position: "absolute",
    left: 12,
    bottom: 12,
    opacity: 0.48,
  },
  decorRight: {
    position: "absolute",
    right: 18,
    top: 96,
    opacity: 0.38,
  },
});
