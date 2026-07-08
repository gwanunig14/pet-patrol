import { Booking } from "@/api/bookings";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import BookingBlock from "./bookingBlock";

export const HOUR_ROW_HEIGHT = 40;
export const DAY_VIEW_HEIGHT = 24 * HOUR_ROW_HEIGHT;

export default function DayScheduleView({
  dateBookings,
  selectedDate,
}: {
  dateBookings: Booking[];
  selectedDate: Date;
}) {
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const hourLines = [
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

  return (
    <View style={[styles.dayView, { maxHeight: SCREEN_HEIGHT - 125 }]}>
      <Text style={styles.currentDate}>
        {Intl.DateTimeFormat("en-us", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(new Date(selectedDate))}
      </Text>
      <ScrollView style={{ width: "100%" }}>
        <View>
          {hourLines.map((h, i) => (
            <View key={i} style={[styles.line, { height: HOUR_ROW_HEIGHT }]}>
              <Text style={styles.hour}>{h}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.bookingList, { height: DAY_VIEW_HEIGHT }]}>
          {dateBookings?.map((db, i) => {
            return (
              <BookingBlock
                booking={db}
                selectedDate={selectedDate}
                index={i}
                key={i}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dayView: { padding: 8, width: "100%" },
  currentDate: { fontSize: 32, color: "green" },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  hour: { fontSize: 16 },
  bookingList: { position: "absolute", top: 0, left: 0, right: 0 },
});
