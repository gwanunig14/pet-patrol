import { Booking } from "@/api/bookings";
import { atStartOfDay, DAY_MS } from "@/functions/date";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import BookingBlock from "./bookingBlock";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./art";
import { DAY_VIEW_HEIGHT, HOUR_ROW_HEIGHT } from "./scheduleConstants";

const HOUR_LABEL_WIDTH = 56;

const HOUR_LINES = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

export default function DayScheduleView({
  dateBookings,
  selectedDate,
  setSelectedDate,
}: {
  dateBookings: Booking[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 700;

  const shiftDate = (days: number) => {
    setSelectedDate(
      atStartOfDay(new Date(selectedDate.getTime() + days * DAY_MS)),
    );
  };

  return (
    <View style={[styles.dayView, compact && styles.dayViewCompact]}>
      <View style={[styles.toolbar, compact && styles.toolbarCompact]}>
        <View style={styles.heading}>
          <View style={styles.headingIcon}>
            <CalendarIcon size={20} color="#ffffff" />
          </View>

          <View style={styles.headingCopy}>
            <Text style={styles.headingTitle}>Schedule</Text>
            <Text style={styles.currentDate}>
              {Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }).format(new Date(selectedDate))}
            </Text>
          </View>
        </View>

        <View style={styles.toolbarActions}>
          <Pressable
            accessibilityLabel="Previous day"
            onPress={() => shiftDate(-1)}
            style={({ pressed }) => [
              styles.toolbarButton,
              styles.iconButton,
              pressed && styles.toolbarButtonPressed,
            ]}
          >
            <ChevronLeftIcon size={17} />
          </Pressable>

          <Pressable
            onPress={() => setSelectedDate(atStartOfDay(new Date()))}
            style={({ pressed }) => [
              styles.toolbarButton,
              pressed && styles.toolbarButtonPressed,
            ]}
          >
            <CalendarIcon size={15} color="#1a7623" />
            <Text style={styles.toolbarButtonText}>Today</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Next day"
            onPress={() => shiftDate(1)}
            style={({ pressed }) => [
              styles.toolbarButton,
              styles.iconButton,
              pressed && styles.toolbarButtonPressed,
            ]}
          >
            <ChevronRightIcon size={17} />
          </Pressable>
        </View>
      </View>

      {dateBookings.length === 0 ? (
        <View style={styles.emptyNotice}>
          <Text style={styles.emptyNoticeTitle}>No bookings on this date</Text>
          <Text style={styles.emptyNoticeText}>
            Accepted bookings will appear in the schedule below.
          </Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        nestedScrollEnabled
      >
        <View style={[styles.gridWrap, { minHeight: DAY_VIEW_HEIGHT }]}>
          {HOUR_LINES.map((label) => (
            <View
              key={label}
              style={[styles.hourRow, { height: HOUR_ROW_HEIGHT }]}
            >
              <Text style={styles.hour}>{label}</Text>
              <View style={styles.hourLine} />
            </View>
          ))}

          <View style={[styles.bookingList, { height: DAY_VIEW_HEIGHT }]}>
            {dateBookings.map((booking, index) => (
              <BookingBlock
                booking={booking}
                selectedDate={selectedDate}
                index={index}
                key={booking.id}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dayView: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#dfe9dc",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.97)",
    shadowColor: "#213a24",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
    overflow: "hidden",
  },
  dayViewCompact: {
    padding: 12,
    borderRadius: 16,
  },
  toolbar: {
    flexShrink: 0,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  toolbarCompact: {
    marginBottom: 9,
  },
  heading: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#138221",
    alignItems: "center",
    justifyContent: "center",
  },
  headingCopy: {
    minWidth: 0,
  },
  headingTitle: {
    color: "#17212b",
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "800",
  },
  currentDate: {
    color: "#1b7a25",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  toolbarButton: {
    height: 32,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: "#d9e4d6",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  iconButton: {
    width: 32,
    paddingHorizontal: 0,
  },
  toolbarButtonPressed: {
    opacity: 0.68,
    backgroundColor: "#f2f8f0",
  },
  toolbarButtonText: {
    color: "#34413c",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyNotice: {
    flexShrink: 0,
    marginBottom: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#dce9d8",
    borderRadius: 9,
    backgroundColor: "#f5faf3",
  },
  emptyNoticeTitle: {
    color: "#265f2b",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyNoticeText: {
    marginTop: 1,
    color: "#6c766f",
    fontSize: 10,
    lineHeight: 14,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e4ebe2",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    minWidth: "100%",
  },
  gridWrap: {
    position: "relative",
  },
  hourRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  hour: {
    width: HOUR_LABEL_WIDTH,
    paddingTop: 5,
    paddingRight: 8,
    color: "#56625d",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
  },
  hourLine: {
    flex: 1,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e7ece5",
  },
  bookingList: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
