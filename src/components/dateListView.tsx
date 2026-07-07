import { DateOption } from "@/functions/date";
import { FlatList, Pressable, Text } from "react-native";

export default function DateListView({
  dateOptions,
  setSelectedDate,
}: {
  dateOptions: DateOption[];
  setSelectedDate: (date: Date) => void;
}) {
  return (
    <FlatList
      data={dateOptions}
      renderItem={({ item }) => (
        <Pressable onPress={() => setSelectedDate(item.date)}>
          <Text>
            {Intl.DateTimeFormat("en-us", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }).format(new Date(item.date))}
          </Text>
        </Pressable>
      )}
    />
  );
}
