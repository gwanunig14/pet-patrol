import { Booking, getBookingsByUser } from "@/api/bookings";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function AppointmentView() {
  const { currentUser } = useAuth();
  if (!currentUser) return;

  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!bookings) {
      const fetchBookings = async () => {
        const userBookings = await getBookingsByUser(currentUser.name);
        setBookings(userBookings);
      };
      fetchBookings();
    }
  });
  return (
    <View>
      <FlatList
        data={bookings}
        renderItem={({ item }) => (
          <View>
            <Text>{item.petName}</Text>
            <Text>
              {Intl.DateTimeFormat("en-us", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                hour12: true,
                minute: "2-digit",
              }).format(new Date(item.startTime))}
            </Text>
            <Text>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
