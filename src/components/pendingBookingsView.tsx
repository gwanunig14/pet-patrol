import { Booking, updateBookingStatus } from "@/api/bookings";
import { atStartOfDay } from "@/functions/date";
import {
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { capitalize } from "./bookingFormView";

export default function PendingBookingsView({
  bookings,
  setBookings,
  setSelectedDate,
}: {
  bookings: Booking[];
  setBookings: (b: any) => void;
  setSelectedDate: (date: Date) => void;
}) {
  const SCREEN_HEIGHT = Dimensions.get("window").height;

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
    <View style={[styles.pendingView, { maxHeight: SCREEN_HEIGHT - 125 }]}>
      <ScrollView>
        {bookings
          ?.filter((b) => b.status === "Pending")
          .map((b, i) => (
            <View key={i} style={styles.booking}>
              <View style={styles.text}>
                <Text style={styles.petName}>{b.petName}</Text>
                <Text style={styles.animal}>{capitalize(b.animal)}</Text>
              </View>
              <Pressable
                style={styles.viewDate}
                onPress={() =>
                  setSelectedDate(atStartOfDay(new Date(b.startTime)))
                }
              >
                <Text style={styles.viewDateText}>View Date</Text>
              </Pressable>
              <Text style={styles.price}>{`$${b.price}`}</Text>
              <View style={styles.interact}>
                <Pressable
                  style={styles.button}
                  onPress={() => acceptBooking(b, true)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() => acceptBooking(b, false)}
                >
                  <Text style={styles.buttonText}>Decline</Text>
                </Pressable>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pendingView: { width: 200, padding: 16 },
  booking: {
    borderWidth: 2,
    borderColor: "green",
    margin: 8,
    padding: 8,
    borderRadius: 8,
  },
  text: { flexDirection: "row", alignItems: "baseline" },
  petName: { fontSize: 24, marginBottom: 4, flex: 1 },
  animal: { fontSize: 16, marginBottom: 4 },
  viewDate: {
    backgroundColor: "green",
    padding: 4,
    borderRadius: 4,
    alignItems: "center",
  },
  viewDateText: { color: "white" },
  price: { marginVertical: 4, fontSize: 20 },
  interact: { flexDirection: "row" },
  button: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "green",
    borderRadius: 4,
    alignItems: "center",
    padding: 4,
  },
  buttonText: { color: "white" },
});
