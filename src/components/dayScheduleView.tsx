import { Booking } from "@/api/bookings";
import { atStartOfDay, DAY_MS } from "@/functions/date";
import { ScrollView, Text, View } from "react-native";

export default function DayScheduleView({
  dateBookings,
  selectedDate,
}: {
  dateBookings: Booking[];
  selectedDate: Date;
}) {
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
    <ScrollView style={{ width: 300 }}>
      <View>
        {hourLines.map((h, i) => (
          <View
            key={i}
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 2,
              height: HOUR_ROW_HEIGHT,
            }}
          >
            <Text>{h}</Text>
          </View>
        ))}
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: DAY_VIEW_HEIGHT,
        }}
      >
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
              style={{
                height: durationMinutes * MINUTE_TO_PX,
                backgroundColor: backgroundColor,
                position: "absolute",
                top: displayStartMinutes * MINUTE_TO_PX,
                left: i % 2 === 0 ? 32 : 40,
                right: i % 2 === 0 ? 12 : 4,
              }}
            >
              <Text>{db.petName}</Text>
              <Text>{db.animal}</Text>
              <Text>{`$${db.price}`}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
