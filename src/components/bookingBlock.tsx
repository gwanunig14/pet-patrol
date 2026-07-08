import { Booking } from "@/api/bookings";
import { atStartOfDay, DAY_MS } from "@/functions/date";
import { StyleSheet, Text, View } from "react-native";
import { HOUR_ROW_HEIGHT } from "./dayScheduleView";
import { capitalize } from "./bookingFormView";

export default function BookingBlock({
  booking,
  selectedDate,
  index,
}: {
  booking: Booking;
  selectedDate: Date;
  index: number;
}) {
  const MINUTE_TO_PX = HOUR_ROW_HEIGHT / 60;
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const dayStart = atStartOfDay(selectedDate);
  const dayEnd = new Date(dayStart.getTime() + DAY_MS);

  const displayStart = new Date(
    Math.max(startTime.getTime(), dayStart.getTime()),
  );
  const displayEnd = new Date(Math.min(endTime.getTime(), dayEnd.getTime()));

  const displayStartMinutes =
    displayStart.getHours() * 60 + displayStart.getMinutes();
  const durationMinutes =
    (displayEnd.getTime() - displayStart.getTime()) / (60 * 1000);

  let backgroundColor = "green";
  if (booking.status === "Pending") {
    backgroundColor = "blue";
  } else if (booking.status === "Declined") {
    backgroundColor = "red";
  }

  return (
    <View
      style={[
        styles.booking,
        {
          height: durationMinutes * MINUTE_TO_PX,
          backgroundColor: backgroundColor,
          top: displayStartMinutes * MINUTE_TO_PX,
          left: index % 2 === 0 ? 48 : 248,
          right: index % 2 === 0 ? 204 : 4,
        },
      ]}
    >
      <View style={styles.info}>
        <Text style={styles.petName}>{booking.petName}</Text>
        <Text style={styles.animal}>{capitalize(booking.animal)}</Text>
        <Text style={styles.price}>{`$${booking.price}`}</Text>
      </View>
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
  info: { flexDirection: "row", height: 28, alignItems: "baseline" },
  petName: { color: "white", fontSize: 24, marginRight: 8 },
  animal: { color: "white", marginRight: 12, fontSize: 16 },
  price: { color: "white", fontSize: 16 },
});
