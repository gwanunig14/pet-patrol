import { Booking } from "@/api/bookings";
import { atStartOfDay, DAY_MS } from "@/functions/date";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { capitalize } from "./bookingFormView";

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

  const HOUR_ROW_HEIGHT = 40;
  const MINUTE_TO_PX = HOUR_ROW_HEIGHT / 60;
  const DAY_VIEW_HEIGHT = 24 * HOUR_ROW_HEIGHT;

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
            const startTime = new Date(db.startTime);
            const endTime = new Date(db.endTime);
            const dayStart = atStartOfDay(selectedDate);
            const dayEnd = new Date(dayStart.getTime() + DAY_MS);

            const displayStart = new Date(
              Math.max(startTime.getTime(), dayStart.getTime()),
            );
            const displayEnd = new Date(
              Math.min(endTime.getTime(), dayEnd.getTime()),
            );

            const displayStartMinutes =
              displayStart.getHours() * 60 + displayStart.getMinutes();
            const durationMinutes =
              (displayEnd.getTime() - displayStart.getTime()) / (60 * 1000);

            let backgroundColor = "green";
            if (db.status === "Pending") {
              backgroundColor = "blue";
            } else if (db.status === "Declined") {
              backgroundColor = "red";
            }

            return (
              <View
                key={i}
                style={[
                  styles.booking,
                  {
                    height: durationMinutes * MINUTE_TO_PX,
                    backgroundColor: backgroundColor,
                    top: displayStartMinutes * MINUTE_TO_PX,
                    left: i % 2 === 0 ? 48 : 56,
                    right: i % 2 === 0 ? 12 : 4,
                  },
                ]}
              >
                <Text style={styles.petName}>{db.petName}</Text>
                <Text style={styles.animal}>{capitalize(db.animal)}</Text>
                <Text style={styles.price}>{`$${db.price}`}</Text>
              </View>
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
  booking: {
    position: "absolute",
    padding: 8,
    borderColor: "black",
    borderWidth: 4,
    borderRadius: 8,
  },
  petName: { color: "white", fontSize: 24, marginBottom: 4 },
  animal: { color: "white", marginBottom: 4, fontSize: 16 },
  price: { color: "white", fontSize: 16 },
});
