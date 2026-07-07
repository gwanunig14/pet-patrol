import { Booking, updateBookingStatus } from "@/api/bookings";
import { atStartOfDay } from "@/functions/date";
import { Button, ScrollView, Text, View } from "react-native";

export default function PendingBookingsView({
  bookings,
  setBookings,
  setSelectedDate,
}: {
  bookings: Booking[];
  setBookings: (b: any) => void;
  setSelectedDate: (date: Date) => void;
}) {
  const acceptBooking = async (booking: Booking, accepted: boolean) => {
    if (!bookings) return;

    const nextStatus: Booking["status"] = accepted ? "Accepted" : "Declined";
    const updatedBooking = await updateBookingStatus(booking.id, nextStatus);

    setBookings((current: Booking[]) =>
      current
        ? current.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
        : current,
    );
  };

  return (
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
            <Button title="Decline" onPress={() => acceptBooking(b, false)} />
          </View>
        ))}
    </ScrollView>
  );
}
