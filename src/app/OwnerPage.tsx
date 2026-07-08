import { Booking, getBookingsByUser } from "@/api/bookings";
import AppointmentView from "@/components/appointmentView";
import BookingForm from "@/components/bookingFormView";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function OwnerView() {
  const { currentUser, setCurrentUser } = useAuth();
  const router = useRouter();

  if (!currentUser) {
    router.replace("/");
    return;
  }

  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!bookings) {
      const fetchBookings = async () => {
        const userBookings = await getBookingsByUser(currentUser?.name);
        setBookings(userBookings);
      };

      fetchBookings();
    }
  });

  const logOut = () => {
    setCurrentUser(null);
    router.replace("/");
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentUser?.name}</Text>
        <Pressable style={styles.logout} onPress={logOut}>
          <Text style={styles.logoutTitle}>Log Out</Text>
        </Pressable>
      </View>
      <View style={styles.bookingViews}>
        <View style={styles.bookingsList}>
          <AppointmentView />
        </View>
        <View style={styles.bookingForm}>
          <BookingForm />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
    position: "relative",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 56,
    color: "green",
  },
  logout: {
    position: "absolute",
    right: 16,
  },
  logoutTitle: {
    fontSize: 20,
    color: "white",
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
  },
  bookingViews: {
    flexDirection: "row",
  },
  bookingsList: { padding: 16 },
  bookingForm: { padding: 16 },
});
