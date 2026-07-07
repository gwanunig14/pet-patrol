import { Booking, getBookingsByUser } from "@/api/bookings";
import AppointmentView from "@/components/appointmentView";
import BookingForm from "@/components/bookingFormView";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

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
      <Text>Owner View</Text>
      <Text>{currentUser?.name}</Text>
      <Button title="Log Out" onPress={logOut} />
      <View>
        <AppointmentView />
      </View>
      <View>
        <BookingForm />
      </View>
    </View>
  );
}
