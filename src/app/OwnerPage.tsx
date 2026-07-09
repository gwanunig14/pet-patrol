import AppointmentView from "@/components/appointmentView";
import BookingForm from "@/components/bookingFormView";
import HeaderView from "@/components/headerView";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function OwnerView() {
  const { currentUser } = useAuth();
  const router = useRouter();

  if (!currentUser) {
    router.replace("/");
    return;
  }

  return (
    <View>
      <HeaderView />
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
  bookingViews: {
    flexDirection: "row",
  },
  bookingsList: { padding: 16 },
  bookingForm: { padding: 16 },
});
