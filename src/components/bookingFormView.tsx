import { Animals, createBooking } from "@/api/bookings";
import { getPrices, Prices } from "@/api/prices";
import { useAuth } from "@/context/auth-context";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  atStartOfDay,
  combineDateAndMinute,
  DateOption,
  DAY_MS,
  formatDateLabel,
  formatTimeLabel,
  HOUR_MS,
  LENGTH_OPTIONS,
  TIME_OPTIONS,
  toDateKey,
} from "@/functions/date";

export default function BookingForm() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const nowRef = useRef(new Date());
  const minStartDateTime = useMemo(
    () => new Date(nowRef.current.getTime() + DAY_MS),
    [],
  );
  const dateOptions = useMemo(() => {
    const firstDate = atStartOfDay(minStartDateTime);

    return Array.from({ length: 30 }, (_, index): DateOption => {
      const date = new Date(firstDate.getTime() + index * DAY_MS);

      return {
        key: toDateKey(date),
        date,
        label: formatDateLabel(date),
      };
    });
  }, []);

  const [selectedDateKey, setSelectedDateKey] = useState(dateOptions[0].key);
  const selectedDate = useMemo(
    () =>
      dateOptions.find((option) => option.key === selectedDateKey)?.date ??
      dateOptions[0].date,
    [dateOptions, selectedDateKey],
  );
  const startTimeOptions = useMemo(
    () =>
      TIME_OPTIONS.filter((minuteOfDay) => {
        const candidate = combineDateAndMinute(selectedDate, minuteOfDay);
        return candidate.getTime() >= minStartDateTime.getTime();
      }),
    [minStartDateTime, selectedDate],
  );
  const [startMinuteOfDay, setStartMinuteOfDay] = useState(
    startTimeOptions[0] ?? 0,
  );
  const [lengthHours, setLengthHours] = useState(2);
  const [animal, setAnimal] = useState<(typeof Animals)[number]>("dog");
  const [petName, setPetName] = useState("");
  const [price, setPrice] = useState(20);
  const [priceList, setPricelist] = useState<Prices | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!priceList) {
      const fetchPrices = async () => {
        const currentPrices = await getPrices();
        setPricelist(currentPrices);
      };
      fetchPrices().catch(() => setError("Could not load prices"));
    }
  }, [priceList]);

  useEffect(() => {
    if (startTimeOptions.length === 0) {
      return;
    }

    if (!startTimeOptions.includes(startMinuteOfDay)) {
      setStartMinuteOfDay(startTimeOptions[0]);
    }
  }, [startMinuteOfDay, startTimeOptions]);

  useEffect(() => {
    if (!priceList) {
      return;
    }

    const animalPrice = priceList[animal];
    const extraHours = Math.max(0, lengthHours - 2);
    setPrice(20 + animalPrice * extraHours);
  }, [animal, lengthHours, priceList]);

  const submitRequest = () => {
    if (!petName) {
      setError("No Name");
      return;
    }
    if (startTimeOptions.length === 0) {
      setError("No valid start times available for this date");
      return;
    }

    const startTime = combineDateAndMinute(selectedDate, startMinuteOfDay);
    const endTime = new Date(startTime.getTime() + lengthHours * HOUR_MS);

    createBooking({
      owner: currentUser.name,
      petName,
      price,
      date: atStartOfDay(selectedDate),
      startTime,
      endTime,
      animal,
      status: "Pending",
    }).catch((e) => setError("Booking failed"));
  };

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return (
    <View style={styles.formView}>
      {error && (
        <Text style={styles.error} onPress={() => setError(null)}>
          {error}
        </Text>
      )}
      <TextInput
        style={styles.petName}
        placeholder="Pet Name"
        onChangeText={(t) => setPetName(t)}
      />
      <View style={styles.formObject}>
        <Text style={styles.formHeader}>Pet Species:</Text>
        <Picker
          style={styles.formDropdown}
          selectedValue={animal}
          onValueChange={(a) => setAnimal(a)}
        >
          {Animals.map((a) => (
            <Picker.Item
              style={styles.formDropdownItem}
              key={a}
              label={capitalize(a)}
              value={a}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.formObject}>
        <Text style={styles.formHeader}>Date Needed:</Text>
        <Picker
          style={styles.formDropdown}
          selectedValue={selectedDateKey}
          onValueChange={(value: string) => setSelectedDateKey(value)}
        >
          {dateOptions.map((option) => (
            <Picker.Item
              style={styles.formDropdownItem}
              key={option.key}
              label={option.label}
              value={option.key}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.formObject}>
        <Text style={styles.formHeader}>Start Time:</Text>
        <Picker
          style={styles.formDropdown}
          selectedValue={startMinuteOfDay}
          onValueChange={(value) => setStartMinuteOfDay(Number(value))}
        >
          {startTimeOptions.map((value) => (
            <Picker.Item
              style={styles.formDropdownItem}
              key={value}
              label={formatTimeLabel(value)}
              value={value}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.formObject}>
        <Text style={styles.formHeader}>Number of Hours:</Text>
        <Picker
          style={styles.formDropdown}
          selectedValue={lengthHours}
          onValueChange={(value) => setLengthHours(Number(value))}
        >
          {LENGTH_OPTIONS.map((hours) => (
            <Picker.Item
              style={styles.formDropdownItem}
              key={hours}
              label={String(hours)}
              value={hours}
            />
          ))}
        </Picker>
      </View>
      <Text style={styles.total}>{`Total: $${price}`}</Text>
      <Text
        style={styles.totalExplanation}
      >{`($20 for first 2 hours + $${priceList ? priceList[animal] : 10} for each additional ${animal} hour)`}</Text>
      <Pressable style={styles.submitButton} onPress={submitRequest}>
        <Text style={styles.submitButtonTitle}>Submit Sitter Request</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formView: { padding: 16, alignItems: "center" },
  error: { fontSize: 24, color: "red" },
  petName: {
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    width: 350,
    fontSize: 24,
    margin: 4,
  },
  formObject: {
    margin: 4,
    width: 350,
    flexDirection: "row",
    justifyContent: "center",
  },
  formHeader: { padding: 4, fontSize: 16 },
  formDropdown: {
    alignSelf: "flex-end",
    flex: 1,
    padding: 4,
    fontSize: 16,
    borderColor: "green",
    borderRadius: 8,
  },
  formDropdownItem: {},
  total: { fontSize: 32, textAlign: "left", width: "100%", padding: 8 },
  totalExplanation: { padding: 8, maxWidth: 350, fontSize: 12 },
  submitButton: {
    padding: 16,
    width: "100%",
    margin: 8,
    backgroundColor: "green",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonTitle: { fontSize: 24, color: "white" },
});
