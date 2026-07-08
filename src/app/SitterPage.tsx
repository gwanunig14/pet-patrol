import { Booking, getBookings, updateBookingStatus } from "@/api/bookings";
import DateListView from "@/components/dateListView";
import DayScheduleView from "@/components/dayScheduleView";
import HeaderView from "@/components/headerView";
import PendingBookingsView from "@/components/pendingBookingsView";
import {
  atStartOfDay,
  DateOption,
  DAY_MS,
  formatDateLabel,
  toDateKey,
} from "@/functions/date";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

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
    <View>
      <HeaderView />
      <View style={{ flexDirection: "row" }}>
        <View>
          <DateListView
            dateOptions={dateOptions}
            setSelectedDate={setSelectedDate}
          />
        </View>
        <View style={{ flex: 1 }}>
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
    </View>
  );
}
