import React, { type Dispatch, type SetStateAction, useState } from "react";
import { Booking, updateBookingStatus } from "@/api/bookings";
import { atStartOfDay } from "@/functions/date";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { capitalize } from "./bookingFormView";
import {
  CalendarIcon,
  CheckIcon,
  PetAvatar,
  XIcon,
} from "./art";

export default function PendingBookingsView({
  bookings,
  setBookings,
  setSelectedDate,
}: {
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[] | null>>;
  setSelectedDate: (date: Date) => void;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  );

  const updateStatus = async (
    booking: Booking,
    nextStatus: Booking["status"],
  ) => {
    try {
      setUpdatingId(booking.id);
      setActionError(null);

      const updatedBooking = await updateBookingStatus(
        booking.id,
        nextStatus,
      );

      setBookings((current) =>
        current
          ? current.map((item) =>
              item.id === updatedBooking.id ? updatedBooking : item,
            )
          : current,
      );
    } catch {
      setActionError("Could not update that request. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <View style={styles.pendingView}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View style={styles.headerIcon}>
            <CalendarIcon size={17} color="#ffffff" />
          </View>
          <Text style={styles.title}>Pending Requests</Text>
        </View>

        <View style={styles.countPill}>
          <Text style={styles.countText}>{pendingBookings.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {actionError ? (
          <Text style={styles.actionError}>{actionError}</Text>
        ) : null}

        {pendingBookings.length > 0 ? (
          pendingBookings.map((booking) => {
            const busy = updatingId === booking.id;

            return (
              <View key={booking.id} style={styles.booking}>
                <View style={styles.topRow}>
                  <PetAvatar animal={booking.animal} size={54} />

                  <View style={styles.petCopy}>
                    <Text numberOfLines={1} style={styles.petName}>
                      {booking.petName}
                    </Text>
                    <Text style={styles.animal}>
                      {capitalize(booking.animal)}
                    </Text>
                  </View>

                  <Text style={styles.price}>{`$${booking.price}`}</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    setSelectedDate(
                      atStartOfDay(new Date(booking.startTime)),
                    )
                  }
                  style={({ pressed }) => [
                    styles.viewDate,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <CalendarIcon size={14} color="#1c7f24" />
                  <Text style={styles.viewDateText}>View Date</Text>
                </Pressable>

                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => updateStatus(booking, "Accepted")}
                    style={({ pressed }) => [
                      styles.button,
                      styles.acceptButton,
                      (pressed || busy) && styles.controlPressed,
                    ]}
                  >
                    <CheckIcon size={14} color="#1b7b26" />
                    <Text style={styles.acceptText}>
                      {busy ? "Saving…" : "Accept"}
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => updateStatus(booking, "Declined")}
                    style={({ pressed }) => [
                      styles.button,
                      styles.declineButton,
                      (pressed || busy) && styles.controlPressed,
                    ]}
                  >
                    <XIcon size={14} color="#d24646" />
                    <Text style={styles.declineText}>Decline</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <CheckIcon size={22} color="#1f8429" />
            </View>
            <Text style={styles.emptyTitle}>You’re all caught up</Text>
            <Text style={styles.emptyText}>
              New sitter requests will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pendingView: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#dfe9dc",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.97)",
    shadowColor: "#213a24",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
    overflow: "hidden",
  },
  header: {
    flexShrink: 0,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerTitle: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#138221",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#17212b",
    fontSize: 17,
    fontWeight: "800",
  },
  countPill: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: 7,
    borderRadius: 13,
    backgroundColor: "#eaf7e8",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "#187723",
    fontSize: 12,
    fontWeight: "800",
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 2,
  },
  actionError: {
    padding: 9,
    borderRadius: 9,
    backgroundColor: "#fff0f0",
    color: "#b83c3c",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
  },
  booking: {
    padding: 11,
    borderWidth: 1,
    borderColor: "#dfe7dd",
    borderRadius: 15,
    backgroundColor: "#ffffff",
    gap: 9,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  petCopy: {
    minWidth: 0,
    flex: 1,
  },
  petName: {
    color: "#1d2724",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  animal: {
    marginTop: 1,
    color: "#67726e",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
  },
  price: {
    color: "#17212b",
    fontSize: 17,
    fontWeight: "800",
  },
  viewDate: {
    minHeight: 34,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#b8dab5",
    borderRadius: 9,
    backgroundColor: "#f5fbf3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  viewDateText: {
    color: "#1a7623",
    fontSize: 12,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    minHeight: 35,
    flex: 1,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  acceptButton: {
    borderColor: "#8fce91",
    backgroundColor: "#eff9ee",
  },
  declineButton: {
    borderColor: "#efb0b0",
    backgroundColor: "#fff7f7",
  },
  acceptText: {
    color: "#1b7224",
    fontSize: 12,
    fontWeight: "800",
  },
  declineText: {
    color: "#d24646",
    fontSize: 12,
    fontWeight: "800",
  },
  controlPressed: {
    opacity: 0.62,
  },
  empty: {
    minHeight: 170,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    width: 44,
    height: 44,
    marginBottom: 9,
    borderRadius: 22,
    backgroundColor: "#eaf7e8",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: "#22302a",
    fontSize: 15,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 4,
    color: "#6b756f",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
});
