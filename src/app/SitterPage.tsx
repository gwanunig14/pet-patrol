import { Booking, getBookings } from "@/api/bookings";
import { CalendarIcon, PawIcon } from "@/components/art";
import DateListView from "@/components/dateListView";
import DayScheduleView from "@/components/dayScheduleView";
import HeaderView from "@/components/headerView";
import PendingBookingsView from "@/components/pendingBookingsView";
import { useAuth } from "@/context/auth-context";
import {
  atStartOfDay,
  DateOption,
  DAY_MS,
  formatDateLabel,
  toDateKey,
} from "@/functions/date";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const PAGE_MAX_WIDTH = 1440;

export default function SitterPage() {
  const { currentUser } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 1120;
  const isPhone = width < 700;

  const dateOptions = useMemo((): DateOption[] => {
    const today = atStartOfDay(new Date());

    return Array.from({ length: 31 }, (_, index) => {
      const date = new Date(today.getTime() + index * DAY_MS);

      return {
        key: toDateKey(date),
        date,
        label: formatDateLabel(date),
      };
    });
  }, []);

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(dateOptions[0].date);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setBookings(null);
    setLoadError(false);

    getBookings()
      .then((sitterBookings) => {
        if (!cancelled) setBookings(sitterBookings);
      })
      .catch(() => {
        if (!cancelled) {
          setBookings([]);
          setLoadError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const dateBookings = useMemo(() => {
    if (!bookings) return [];

    const selectedDateKey = toDateKey(selectedDate);

    return bookings.filter(
      (booking) =>
        toDateKey(new Date(booking.startTime)) === selectedDateKey ||
        toDateKey(new Date(booking.endTime)) === selectedDateKey,
    );
  }, [bookings, selectedDate]);

  const pendingCount =
    bookings?.filter((booking) => booking.status === "Pending").length ?? 0;

  return (
    <View style={styles.screen}>
      <HeaderView />

      <View
        style={[styles.page, isPhone ? styles.pagePhone : styles.pageDesktop]}
      >
        <View style={[styles.intro, isPhone && styles.introPhone]}>
          <View style={styles.introIcon}>
            <CalendarIcon size={isPhone ? 20 : 25} color="#ffffff" />
          </View>

          <View style={styles.introCopy}>
            <Text style={styles.eyebrow}>
              Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}!
            </Text>
            <Text style={[styles.title, isPhone && styles.titlePhone]}>
              Your Sitter Schedule
            </Text>
            {!isPhone ? (
              <Text style={styles.subtitle}>
                View your bookings and manage incoming pet-sitting requests.
              </Text>
            ) : null}
          </View>

          {!isPhone ? (
            <View style={styles.pendingSummary}>
              <Text style={styles.pendingSummaryNumber}>{pendingCount}</Text>
              <Text style={styles.pendingSummaryLabel}>
                pending {pendingCount === 1 ? "request" : "requests"}
              </Text>
            </View>
          ) : null}
        </View>

        <View
          style={[styles.body, isWide ? styles.bodyWide : styles.bodyStacked]}
        >
          <View
            style={[
              styles.leftRail,
              !isWide && styles.leftRailStacked,
            ]}
          >
            <DateListView
              dateOptions={dateOptions}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </View>

          <View
            style={[
              styles.scheduleRail,
              !isWide && styles.scheduleRailStacked,
            ]}
          >
            {bookings === null ? (
              <View style={styles.stateCard}>
                <ActivityIndicator color="#1f8f2b" size="large" />
                <Text style={styles.stateText}>Loading your schedule…</Text>
              </View>
            ) : loadError ? (
              <View style={styles.stateCard}>
                <Text style={styles.errorTitle}>Could not load bookings</Text>
                <Text style={styles.stateText}>
                  Check the connection and refresh the page.
                </Text>
              </View>
            ) : (
              <DayScheduleView
                dateBookings={dateBookings}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}
          </View>

          <View
            style={[
              styles.pendingRail,
              !isWide && styles.pendingRailStacked,
            ]}
          >
            {bookings === null ? (
              <View style={styles.stateCard}>
                <ActivityIndicator color="#1f8f2b" />
                <Text style={styles.stateText}>Loading requests…</Text>
              </View>
            ) : (
              <PendingBookingsView
                bookings={bookings}
                setBookings={setBookings}
                setSelectedDate={setSelectedDate}
              />
            )}
          </View>
        </View>
      </View>

      {!isPhone ? (
        <>
          <View pointerEvents="none" style={styles.decorLeft}>
            <PawIcon size={54} color="#dce9d8" />
          </View>
          <View pointerEvents="none" style={styles.decorRight}>
            <PawIcon size={46} color="#dce9d8" />
          </View>
        </>
      ) : null}
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
  },
  pageDesktop: {
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 20,
  },
  pagePhone: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  intro: {
    flexShrink: 0,
    minHeight: 96,
    marginBottom: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#dfe9dc",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.94)",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#213a24",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  introPhone: {
    minHeight: 68,
    marginBottom: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 10,
  },
  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#138221",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#138221",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  introCopy: {
    minWidth: 0,
    flex: 1,
  },
  eyebrow: {
    marginBottom: 1,
    color: "#21812a",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  title: {
    color: "#17212b",
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.45,
  },
  titlePhone: {
    fontSize: 20,
    lineHeight: 24,
  },
  subtitle: {
    marginTop: 2,
    color: "#66716e",
    fontSize: 12,
    lineHeight: 17,
  },
  pendingSummary: {
    minWidth: 118,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#d8e9d5",
    borderRadius: 13,
    backgroundColor: "#f4faf2",
    alignItems: "center",
  },
  pendingSummaryNumber: {
    color: "#177623",
    fontSize: 22,
    lineHeight: 25,
    fontWeight: "800",
  },
  pendingSummaryLabel: {
    marginTop: 1,
    color: "#647064",
    fontSize: 10,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    minHeight: 0,
    gap: 14,
  },
  bodyWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  bodyStacked: {
    flexDirection: "column",
  },
  leftRail: {
    width: 218,
    minHeight: 0,
  },
  leftRailStacked: {
    width: "100%",
    height: 84,
    flexShrink: 0,
  },
  scheduleRail: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
  scheduleRailStacked: {
    flex: 1.25,
    width: "100%",
  },
  pendingRail: {
    width: 304,
    minHeight: 0,
  },
  pendingRailStacked: {
    flex: 0.9,
    width: "100%",
  },
  stateCard: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#dfe9dc",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#213a24",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  stateText: {
    color: "#68736e",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  errorTitle: {
    color: "#b83c3c",
    fontSize: 16,
    fontWeight: "700",
  },
  decorLeft: {
    position: "absolute",
    left: 12,
    top: 142,
    opacity: 0.45,
  },
  decorRight: {
    position: "absolute",
    right: 18,
    top: 112,
    opacity: 0.42,
  },
});
