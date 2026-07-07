import { Booking, getBookings, updateBookingStatus } from "@/api/bookings";
import DateListView from "@/components/dateListView";
import DayScheduleView from "@/components/dayScheduleView";
import PendingBookingsView from "@/components/pendingBookingsView";
import {
  atStartOfDay,
  DateOption,
  DAY_MS,
  formatDateLabel,
  toDateKey,
} from "@/functions/date";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Text, View } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

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

  return (
    <View style={{ flexDirection: "row", maxHeight: SCREEN_HEIGHT }}>
      <View>
        <DateListView
          dateOptions={dateOptions}
          setSelectedDate={setSelectedDate}
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
        {dateBookings && (
          <DayScheduleView
            dateBookings={dateBookings}
            selectedDate={selectedDate}
          />
        )}
      </View>
      <View>
        {bookings && (
          <PendingBookingsView
            bookings={bookings}
            setBookings={setBookings}
            setSelectedDate={setSelectedDate}
          />
        )}
      </View>
    </View>
  );
}
