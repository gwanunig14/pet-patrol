import { Animals, createBooking } from "@/api/bookings";
import { getPrices, Prices } from "@/api/prices";
import { useAuth } from "@/context/auth-context";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => index * 30);
const LENGTH_OPTIONS = Array.from({ length: 7 }, (_, index) => index + 2);

type DateOption = {
  key: string;
  date: Date;
  label: string;
};

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function atStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function combineDateAndMinute(date: Date, minuteOfDay: number): Date {
  const result = atStartOfDay(date);
  result.setMinutes(minuteOfDay);
  return result;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTimeLabel(minuteOfDay: number): string {
  const hours24 = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

export default function BookingForm() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const nowRef = useRef(new Date());
  const minStartDateTime = useMemo(
    () => new Date(nowRef.current.getTime() + DAY_MS),
    [],
  );
  const dateOptions = useMemo(() => {
    const firstDate = atStartOfDay(new Date(nowRef.current.getTime() + DAY_MS));

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
    <View>
      {error && <Text onPress={() => setError(null)}>{error}</Text>}
      <TextInput placeholder="Pet Name" onChangeText={(t) => setPetName(t)} />
      <Picker selectedValue={animal} onValueChange={(a) => setAnimal(a)}>
        {Animals.map((a) => (
          <Picker.Item key={a} label={capitalize(a)} value={a} />
        ))}
      </Picker>
      <Text>Date</Text>
      <Picker
        selectedValue={selectedDateKey}
        onValueChange={(value: string) => setSelectedDateKey(value)}
      >
        {dateOptions.map((option) => (
          <Picker.Item
            key={option.key}
            label={option.label}
            value={option.key}
          />
        ))}
      </Picker>

      <Text>Start Time</Text>
      <Picker
        selectedValue={startMinuteOfDay}
        onValueChange={(value) => setStartMinuteOfDay(Number(value))}
      >
        {startTimeOptions.map((value) => (
          <Picker.Item
            key={value}
            label={formatTimeLabel(value)}
            value={value}
          />
        ))}
      </Picker>

      <Text>Number of Hours</Text>
      <Picker
        selectedValue={lengthHours}
        onValueChange={(value) => setLengthHours(Number(value))}
      >
        {LENGTH_OPTIONS.map((hours) => (
          <Picker.Item key={hours} label={String(hours)} value={hours} />
        ))}
      </Picker>
      <Text>{`Total: $${price}`}</Text>
      <Text>{`($20 for first 2 hours + $${priceList ? priceList[animal] : 10} for each additional ${animal} hour)`}</Text>
      <Button title={"Submit Sitter Request"} onPress={submitRequest} />
    </View>
  );
}
