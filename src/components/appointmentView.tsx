import { Booking, getBookingsByUser } from "@/api/bookings";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AppointmentView() {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
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
    <View style={{ maxHeight: SCREEN_HEIGHT - 125, padding: 8 }}>
      <ScrollView>
        <FlatList
          data={bookings}
          renderItem={({ item }) => {
            let statusColor = "blue";
            if (item.status === "Approved") {
              statusColor = "green";
            } else if (item.status === "Declined") {
              statusColor = "red";
            }
            return (
              <View style={styles.booking}>
                <Text style={styles.petName}>{item.petName}</Text>
                <Text style={styles.date}>
                  {Intl.DateTimeFormat("en-us", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    hour12: true,
                    minute: "2-digit",
                  }).format(new Date(item.startTime))}
                </Text>
                <Text style={{ color: statusColor }}>{item.status}</Text>
              </View>
            );
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  booking: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "green",
  },
  petName: { fontSize: 24, paddingBottom: 4 },
  date: { paddingBottom: 4 },
});
