import { Booking } from "@/api/bookings";
import { atStartOfDay, DAY_MS } from "@/functions/date";
import { StyleSheet, Text, View } from "react-native";
import { capitalize } from "./bookingFormView";
import { PetAvatar } from "./art";
import { HOUR_ROW_HEIGHT } from "./scheduleConstants";

const HOUR_LABEL_GUTTER = 64;
const MIN_BLOCK_HEIGHT = 30;

const STATUS_STYLES: Record<
  Booking["status"],
  {
    backgroundColor: string;
    borderColor: string;
    accentColor: string;
    titleColor: string;
    detailColor: string;
    label: string;
  }
> = {
  Accepted: {
    backgroundColor: "#eaf7e7",
    borderColor: "#5caf63",
    accentColor: "#178127",
    titleColor: "#184b21",
    detailColor: "#397042",
    label: "Accepted",
  },
  Pending: {
    backgroundColor: "#edf4ff",
    borderColor: "#87abe1",
    accentColor: "#3974bd",
    titleColor: "#234f85",
    detailColor: "#4f6d91",
    label: "Pending",
  },
  Declined: {
    backgroundColor: "#fff1f1",
    borderColor: "#e59a9a",
    accentColor: "#cf4a4a",
    titleColor: "#8e3232",
    detailColor: "#9a5b5b",
    label: "Declined",
  },
};

function formatBookingTime(date: Date): string {
  return Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function BookingBlock({
  booking,
  selectedDate,
  index,
}: {
  booking: Booking;
  selectedDate: Date;
  index: number;
}) {
  const minuteToPx = HOUR_ROW_HEIGHT / 60;
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const dayStart = atStartOfDay(selectedDate);
  const dayEnd = new Date(dayStart.getTime() + DAY_MS);

  const displayStart = new Date(
    Math.max(startTime.getTime(), dayStart.getTime()),
  );
  const displayEnd = new Date(Math.min(endTime.getTime(), dayEnd.getTime()));

  const durationMinutes = Math.max(
    0,
    (displayEnd.getTime() - displayStart.getTime()) / (60 * 1000),
  );

  if (durationMinutes <= 0) return null;

  const displayStartMinutes =
    displayStart.getHours() * 60 + displayStart.getMinutes();
  const naturalHeight = durationMinutes * minuteToPx;
  const blockHeight = Math.max(MIN_BLOCK_HEIGHT, naturalHeight);
  const compact = blockHeight < 54;
  const showAvatar = blockHeight >= 72;
  const showMeta = blockHeight >= 46;
  const palette = STATUS_STYLES[booking.status];

  return (
    <View
      style={[
        styles.booking,
        {
          height: blockHeight,
          top: displayStartMinutes * minuteToPx,
          left: HOUR_LABEL_GUTTER,
          right: 10,
          zIndex: index + 1,
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          borderLeftColor: palette.accentColor,
        },
      ]}
    >
      <View style={[styles.content, compact && styles.contentCompact]}>
        {showAvatar ? (
          <View style={styles.avatarWrap}>
            <PetAvatar animal={booking.animal} size={42} />
          </View>
        ) : null}

        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.petName,
                compact && styles.petNameCompact,
                { color: palette.titleColor },
              ]}
            >
              {booking.petName}
            </Text>

            {!compact ? (
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: `${palette.accentColor}18` },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: palette.accentColor }]}
                >
                  {palette.label}
                </Text>
              </View>
            ) : null}
          </View>

          {showMeta ? (
            <View style={styles.metaRow}>
              <Text
                numberOfLines={1}
                style={[styles.metaText, { color: palette.detailColor }]}
              >
                {capitalize(booking.animal)}
              </Text>
              <Text style={[styles.metaDot, { color: palette.detailColor }]}>
                •
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.metaText, { color: palette.detailColor }]}
              >
                {formatBookingTime(displayStart)}–
                {formatBookingTime(displayEnd)}
              </Text>
              <Text style={[styles.metaDot, { color: palette.detailColor }]}>
                •
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.price, { color: palette.accentColor }]}
              >
                ${booking.price}
              </Text>
            </View>
          ) : (
            <Text
              numberOfLines={1}
              style={[styles.compactMeta, { color: palette.detailColor }]}
            >
              {formatBookingTime(displayStart)} · ${booking.price}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  booking: {
    position: "absolute",
    minWidth: 0,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 11,
    overflow: "hidden",
    shadowColor: "#18351d",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
    elevation: 2,
  },
  content: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  contentCompact: {
    alignItems: "center",
  },
  avatarWrap: {
    paddingTop: 1,
  },
  copy: {
    minWidth: 0,
    flex: 1,
  },
  titleRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  petName: {
    minWidth: 0,
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  petNameCompact: {
    fontSize: 13,
    lineHeight: 16,
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.35,
  },
  metaRow: {
    minWidth: 0,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
  },
  metaDot: {
    paddingHorizontal: 5,
    fontSize: 10,
  },
  price: {
    flexShrink: 0,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
  },
  compactMeta: {
    marginTop: 1,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "600",
  },
});
