import { DateOption } from "@/functions/date";
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DateListView({
  dateOptions,
  setSelectedDate,
}: {
  dateOptions: DateOption[];
  setSelectedDate: (date: Date) => void;
}) {
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  return (
    <View style={[styles.datesView, { maxHeight: SCREEN_HEIGHT - 105 }]}>
      <ScrollView style={styles.scroll}>
        <FlatList
          data={dateOptions}
          renderItem={({ item }) => (
            <Pressable
              style={styles.dateObject}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={styles.dateText}>
                {Intl.DateTimeFormat("en-us", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }).format(new Date(item.date))}
              </Text>
            </Pressable>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  datesView: { paddingVertical: 16 },
  scroll: { paddingHorizontal: 24 },
  dateObject: {
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    width: 120,
  },
  dateText: {},
});
