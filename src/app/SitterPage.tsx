import { Booking, getBookings, updateBookingStatus } from "@/api/bookings";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_ROW_HEIGHT = 40;
const MINUTE_TO_PX = HOUR_ROW_HEIGHT / 60;
const DAY_VIEW_HEIGHT = 24 * HOUR_ROW_HEIGHT;
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

type DateOption = {
  key: string;
  date: Date;
  label: string;
};

function atStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function SitterPage() {
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
  const [dateBookings, setDateBookings] = useState<Booking[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(dateOptions[0].date);

  useEffect(() => {
    const fetchBookings = async () => {
      const sittersBookings = await getBookings();
      setBookings(sittersBookings);
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (!bookings) {
      setDateBookings(null);
      return;
    }

    const selectedDateKey = toDateKey(selectedDate);
    const filtered = bookings.filter(
      (booking) =>
        toDateKey(new Date(booking.startTime)) === selectedDateKey ||
        toDateKey(new Date(booking.endTime)) === selectedDateKey,
    );

    setDateBookings(filtered);
  }, [bookings, selectedDate]);

  const acceptBooking = async (booking: Booking, accepted: boolean) => {
    if (!bookings) return;

    const nextStatus: Booking["status"] = accepted ? "Accepted" : "Declined";
    const updatedBooking = await updateBookingStatus(booking.id, nextStatus);

    setBookings((current) =>
      current
        ? current.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
        : current,
    );
  };

  return (
    <View style={{ flexDirection: "row", maxHeight: SCREEN_HEIGHT }}>
      <View>
        <FlatList
          data={dateOptions}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedDate(item.date)}>
              <Text>
                {Intl.DateTimeFormat("en-us", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }).format(new Date(item.date))}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <View>
        <Text>
          {Intl.DateTimeFormat("en-us", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }).format(new Date(selectedDate))}
        </Text>
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

              // Clip booking to day boundaries
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
      </View>
      <View>
        <ScrollView>
          {bookings
            ?.filter((b) => b.status === "Pending")
            .map((b, i) => (
              <View
                key={i}
                style={{ borderWidth: 2, borderColor: "black", margin: 8 }}
              >
                <Text>{b.petName}</Text>
                <Text>{b.animal}</Text>
                <Button
                  title="View Date"
                  onPress={() =>
                    setSelectedDate(atStartOfDay(new Date(b.startTime)))
                  }
                />
                <Text>{`$${b.price}`}</Text>
                <Button title="Accept" onPress={() => acceptBooking(b, true)} />
                <Button
                  title="Decline"
                  onPress={() => acceptBooking(b, false)}
                />
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}
