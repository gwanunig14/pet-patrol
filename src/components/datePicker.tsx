import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";

interface DatePickerProps {
  minDate: Date;
  maxDate?: Date | null;
  selectedDate: Date;
  setDate: (date: Date) => void;
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => index * 30);

export default function DatePicker({
  minDate,
  maxDate,
  selectedDate,
  setDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(selectedDate);
  const [minuteOfDay, setMinuteOfDay] = useState(
    roundToThirtyMinutes(
      selectedDate.getHours() * 60 + selectedDate.getMinutes(),
    ),
  );
  const { minMinuteOfDay, maxMinuteOfDay } = getAllowedTimeRange(
    pendingDate,
    minDate,
    maxDate,
  );
  const timeOptions = TIME_OPTIONS.filter(
    (value) => value >= minMinuteOfDay && value <= maxMinuteOfDay,
  );

  useEffect(() => {
    if (timeOptions.length === 0) {
      return;
    }

    if (!timeOptions.includes(minuteOfDay)) {
      setMinuteOfDay(timeOptions[0]);
    }
  }, [minuteOfDay, timeOptions]);

  function openPicker() {
    setPendingDate(new Date(selectedDate));
    setMinuteOfDay(
      roundToThirtyMinutes(
        selectedDate.getHours() * 60 + selectedDate.getMinutes(),
      ),
    );
    setIsOpen(true);
  }

  function handleCalendarChange(date: DateType) {
    if (!date) {
      return;
    }

    const chosenDate = new Date(date.valueOf());
    const hours = Math.floor(minuteOfDay / 60);
    const minutes = minuteOfDay % 60;

    chosenDate.setHours(hours, minutes, 0, 0);

    setPendingDate(chosenDate);
  }

  function applySelection() {
    const nextDate = new Date(pendingDate);
    const hours = Math.floor(minuteOfDay / 60);
    const minutes = minuteOfDay % 60;

    nextDate.setHours(hours, minutes, 0, 0);

    setDate(clampDate(nextDate, minDate, maxDate));
    setIsOpen(false);
  }

  return (
    <View>
      <Pressable onPress={openPicker}>
        <Text>
          {selectedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>

        <Text>
          {selectedDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </Text>
      </Pressable>

      {isOpen && (
        <View>
          <View>
            <View>
              <View>
                <Picker
                  selectedValue={minuteOfDay}
                  onValueChange={(value: number) => setMinuteOfDay(value)}
                >
                  {timeOptions.map((value) => (
                    <Picker.Item
                      key={value}
                      label={formatTimeLabel(value)}
                      value={value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Pressable onPress={applySelection}>
                <Text>Apply</Text>
              </Pressable>

              <Pressable onPress={() => setIsOpen(false)}>
                <Text>Cancel</Text>
              </Pressable>
            </View>
          </View>

          <DateTimePicker
            mode="single"
            date={pendingDate}
            minDate={minDate}
            maxDate={maxDate ?? undefined}
            initialView="day"
            disableMonthPicker
            disableYearPicker
            showOutsideDays={false}
            firstDayOfWeek={0}
            onChange={({ date }) => handleCalendarChange(date)}
          />
        </View>
      )}
    </View>
  );
}

function roundToThirtyMinutes(totalMinutes: number): number {
  const rounded = Math.round(totalMinutes / 30) * 30;
  return rounded >= 24 * 60 ? 23 * 60 + 30 : rounded;
}

function roundUpToThirtyMinutes(totalMinutes: number): number {
  const rounded = Math.ceil(totalMinutes / 30) * 30;
  return rounded >= 24 * 60 ? 23 * 60 + 30 : rounded;
}

function roundDownToThirtyMinutes(totalMinutes: number): number {
  const rounded = Math.floor(totalMinutes / 30) * 30;
  return rounded < 0 ? 0 : rounded;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getAllowedTimeRange(
  selectedDay: Date,
  minDate: Date,
  maxDate?: Date | null,
): { minMinuteOfDay: number; maxMinuteOfDay: number } {
  let minMinuteOfDay = 0;
  let maxMinuteOfDay = 23 * 60 + 30;

  if (isSameDay(selectedDay, minDate)) {
    minMinuteOfDay = roundUpToThirtyMinutes(
      minDate.getHours() * 60 + minDate.getMinutes(),
    );
  }

  if (maxDate && isSameDay(selectedDay, maxDate)) {
    maxMinuteOfDay = roundDownToThirtyMinutes(
      maxDate.getHours() * 60 + maxDate.getMinutes(),
    );
  }

  if (minMinuteOfDay > maxMinuteOfDay) {
    return { minMinuteOfDay, maxMinuteOfDay: minMinuteOfDay };
  }

  return { minMinuteOfDay, maxMinuteOfDay };
}

function formatTimeLabel(minuteOfDay: number): string {
  const hours24 = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

function clampDate(date: Date, minDate: Date, maxDate?: Date | null): Date {
  if (date < minDate) {
    return new Date(minDate);
  }

  if (maxDate && date > maxDate) {
    return new Date(maxDate);
  }

  return date;
}
