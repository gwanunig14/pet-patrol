import { DateOption, toDateKey } from "@/functions/date";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { CalendarIcon, CheckIcon } from "./art";

export default function DateListView({
  dateOptions,
  selectedDate,
  setSelectedDate,
}: {
  dateOptions: DateOption[];
  selectedDate?: Date;
  setSelectedDate: (date: Date) => void;
}) {
  const { width } = useWindowDimensions();
  const horizontal = width < 1120;
  const selectedKey = selectedDate ? toDateKey(selectedDate) : null;

  return (
    <View style={[styles.shell, horizontal && styles.shellHorizontal]}>
      {!horizontal ? (
        <View style={styles.titleRow}>
          <View style={styles.iconBubble}>
            <CalendarIcon size={17} color="#177623" />
          </View>
          <Text style={styles.title}>Select Date</Text>
        </View>
      ) : null}

      <ScrollView
        horizontal={horizontal}
        style={styles.scroll}
        contentContainerStyle={[
          styles.listContent,
          horizontal
            ? styles.listContentHorizontal
            : styles.listContentVertical,
        ]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {dateOptions.map((item) => {
          const active = selectedKey === item.key;
          const date = new Date(item.date);

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={item.key}
              onPress={() => setSelectedDate(item.date)}
              style={({ pressed }) => [
                styles.dateObject,
                horizontal
                  ? styles.dateObjectHorizontal
                  : styles.dateObjectVertical,
                active && styles.dateObjectActive,
                pressed && styles.dateObjectPressed,
              ]}
            >
              <View style={styles.dateCopy}>
                <Text
                  style={[styles.weekday, active && styles.dateTextActive]}
                >
                  {Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                  }).format(date)}
                </Text>
                <Text
                  style={[styles.monthDay, active && styles.dateTextActive]}
                >
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(date)}
                </Text>
              </View>

              {active && !horizontal ? (
                <View style={styles.check}>
                  <CheckIcon size={12} color="#ffffff" />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#dfe9dc",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.96)",
    shadowColor: "#213a24",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
    overflow: "hidden",
  },
  shellHorizontal: {
    flex: 1,
    paddingHorizontal: 9,
    paddingVertical: 9,
    borderRadius: 16,
  },
  titleRow: {
    flexShrink: 0,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eef8ec",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#17212b",
    fontSize: 16,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    alignItems: "stretch",
  },
  listContentVertical: {
    gap: 8,
    paddingBottom: 2,
  },
  listContentHorizontal: {
    alignItems: "center",
    paddingHorizontal: 2,
    gap: 8,
  },
  dateObject: {
    borderWidth: 1,
    borderColor: "#dfe7dd",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateObjectVertical: {
    width: "100%",
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateObjectHorizontal: {
    width: 82,
    height: 54,
    paddingHorizontal: 9,
    paddingVertical: 6,
    justifyContent: "center",
  },
  dateObjectActive: {
    borderColor: "#58ad60",
    backgroundColor: "#edf8eb",
  },
  dateObjectPressed: {
    opacity: 0.7,
  },
  dateCopy: {
    alignItems: "flex-start",
  },
  weekday: {
    color: "#6a746f",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
  monthDay: {
    color: "#25302d",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
  },
  dateTextActive: {
    color: "#176f21",
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#188127",
    alignItems: "center",
    justifyContent: "center",
  },
});
