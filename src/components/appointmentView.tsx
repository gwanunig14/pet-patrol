import { Booking, getBookingsByUser } from "@/api/bookings";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PetAvatar } from "./art";

type AppointmentViewProps = {
  horizontal?: boolean;
};

type StatusStyle = {
  text: string;
  background: string;
  border: string;
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  Accepted: {
    text: "#18752a",
    background: "#e8f7e9",
    border: "#c6e9c9",
  },
  Pending: {
    text: "#245cbe",
    background: "#eaf1ff",
    border: "#d3e1ff",
  },
  Declined: {
    text: "#c83838",
    background: "#fff0f0",
    border: "#ffd3d3",
  },
};

function formatBookingDate(value: Date | string | number) {
  return Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export default function AppointmentView({
  horizontal = false,
}: AppointmentViewProps) {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!currentUser) {
      setBookings([]);
      return;
    }

    setBookings(null);
    setLoadError(false);

    getBookingsByUser(currentUser.name)
      .then((userBookings) => {
        if (!cancelled) setBookings(userBookings);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
          setBookings([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  if (!currentUser) return null;

  if (bookings === null) {
    return (
      <View style={styles.stateView}>
        <ActivityIndicator color="#1f8f2b" />
        <Text style={styles.stateText}>Loading requests…</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.stateView}>
        <Text style={styles.errorText}>Could not load your requests.</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyTitle}>No requests yet</Text>
        <Text style={styles.emptyText}>
          Your submitted sitter requests will appear here.
        </Text>
      </View>
    );
  }

  const cards = bookings.map((item) => {
    const statusStyle = STATUS_STYLES[item.status] ?? STATUS_STYLES.Pending;

    return (
      <View
        key={item.id}
        style={[
          styles.booking,
          horizontal ? styles.bookingHorizontal : styles.bookingVertical,
          item.status === "Accepted" && styles.acceptedBooking,
        ]}
      >
        <PetAvatar animal={item.animal} size={horizontal ? 64 : 58} />

        <View
          style={[
            styles.bookingCopy,
            horizontal && styles.bookingCopyHorizontal,
          ]}
        >
          <Text numberOfLines={1} style={styles.petName}>
            {item.petName}
          </Text>
          <Text
            numberOfLines={horizontal ? 2 : 1}
            style={[styles.date, horizontal && styles.dateHorizontal]}
          >
            {formatBookingDate(item.startTime)}
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: statusStyle.background,
              borderColor: statusStyle.border,
            },
            horizontal && styles.statusPillHorizontal,
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  });

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}
      >
        {cards}
      </ScrollView>
    );
  }

  return <View style={styles.verticalList}>{cards}</View>;
}

const styles = StyleSheet.create({
  verticalList: {
    gap: 10,
  },
  horizontalContent: {
    paddingRight: 2,
    gap: 12,
  },
  booking: {
    borderWidth: 1,
    borderColor: "#e0e7de",
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
  bookingVertical: {
    minHeight: 84,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bookingHorizontal: {
    width: 158,
    minHeight: 196,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptedBooking: {
    borderColor: "#52a65a",
    borderWidth: 1.5,
    backgroundColor: "#fcfffc",
  },
  bookingCopy: {
    flex: 1,
    minWidth: 0,
  },
  bookingCopyHorizontal: {
    width: "100%",
    marginTop: 8,
    alignItems: "center",
  },
  petName: {
    color: "#1c252e",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
  },
  date: {
    marginTop: 2,
    color: "#65706d",
    fontSize: 12,
    lineHeight: 17,
  },
  dateHorizontal: {
    minHeight: 34,
    textAlign: "center",
  },
  statusPill: {
    minWidth: 76,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPillHorizontal: {
    marginTop: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  stateView: {
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stateText: {
    color: "#6b756f",
    fontSize: 13,
  },
  errorText: {
    color: "#bd3838",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyView: {
    minHeight: 150,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: "#1d2821",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    maxWidth: 260,
    marginTop: 5,
    color: "#6b756f",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
