import { Animals, createBooking } from "@/api/bookings";
import { getPrices, Prices } from "@/api/prices";
import { useAuth } from "@/context/auth-context";
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
import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { CalendarIcon, ClockIcon, PawIcon, ShieldCheckIcon } from "./art";

const GREEN = "#11851f";
const GREEN_DARK = "#0b6417";
const GREEN_BORDER = "#bad9bc";
const TEXT = "#121722";
const TEXT_MUTED = "#667085";
const SURFACE = "#ffffff";
const BACKGROUND = "#f7f9f7";
const BORDER = "#e2e8e2";
const ERROR = "#c62828";

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type FieldProps = {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: object;
};

function Field({ label, icon, children, style }: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.control}>
        {icon ? <View style={styles.controlIcon}>{icon}</View> : null}
        <View style={styles.controlContent}>{children}</View>
      </View>
    </View>
  );
}

export default function BookingForm() {
  const { currentUser } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 720;

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
  }, [minStartDateTime]);

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
  const [priceList, setPriceList] = useState<Prices | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getPrices()
      .then((currentPrices) => {
        if (!cancelled) setPriceList(currentPrices);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load prices");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      startTimeOptions.length > 0 &&
      !startTimeOptions.includes(startMinuteOfDay)
    ) {
      setStartMinuteOfDay(startTimeOptions[0]);
    }
  }, [startMinuteOfDay, startTimeOptions]);

  const hourlyRate = priceList?.[animal] ?? 10;
  const extraHours = Math.max(0, lengthHours - 2);
  const price = 20 + hourlyRate * extraHours;

  const submitRequest = async () => {
    const normalizedName = petName.trim();

    if (!currentUser) return;

    if (!normalizedName) {
      setError("Enter your pet's name");
      return;
    }

    if (startTimeOptions.length === 0) {
      setError("No valid start times are available for this date");
      return;
    }

    const startTime = combineDateAndMinute(selectedDate, startMinuteOfDay);
    const endTime = new Date(startTime.getTime() + lengthHours * HOUR_MS);

    setError(null);
    setSubmitting(true);

    try {
      await createBooking({
        owner: currentUser.name,
        petName: normalizedName,
        price,
        date: atStartOfDay(selectedDate),
        startTime,
        endTime,
        animal,
        status: "Pending",
      });
      setPetName("");
    } catch {
      setError("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <View style={styles.screen}>
      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <View style={styles.headingRow}>
          <View style={styles.headingIcon}>
            <CalendarIcon size={26} color="#ffffff" />
          </View>
          <View style={styles.headingCopy}>
            <Text style={styles.title}>Request a Sitter</Text>
            <Text style={styles.subtitle}>
              Tell us about your pet and when you need care.
            </Text>
          </View>
        </View>

        {error ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setError(null)}
            style={styles.errorBanner}
          >
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorDismiss}>Dismiss</Text>
          </Pressable>
        ) : null}

        <View style={[styles.contentRow, isMobile && styles.contentColumn]}>
          <View style={[styles.formColumn, isMobile && styles.fullWidth]}>
            <Field label="Pet Name" icon={<PawIcon size={21} />}>
              <TextInput
                value={petName}
                placeholder="Pet Name"
                placeholderTextColor="#98a2b3"
                onChangeText={(value) => {
                  setPetName(value);
                  if (error) setError(null);
                }}
                autoCapitalize="words"
                returnKeyType="done"
                style={styles.textInput}
              />
            </Field>

            <Field label="Pet Species" icon={<PawIcon size={21} />}>
              <Picker
                style={styles.picker}
                selectedValue={animal}
                dropdownIconColor={GREEN_DARK}
                onValueChange={(value) =>
                  setAnimal(value as (typeof Animals)[number])
                }
              >
                {Animals.map((value) => (
                  <Picker.Item
                    key={value}
                    label={capitalize(value)}
                    value={value}
                  />
                ))}
              </Picker>
            </Field>

            <View style={[styles.splitRow, isMobile && styles.splitRowMobile]}>
              <Field
                label="Date Needed"
                icon={<CalendarIcon size={21} />}
                style={styles.splitField}
              >
                <Picker
                  style={styles.picker}
                  selectedValue={selectedDateKey}
                  dropdownIconColor={GREEN_DARK}
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
              </Field>

              <Field
                label="Start Time"
                icon={<ClockIcon size={21} />}
                style={styles.splitField}
              >
                <Picker
                  style={styles.picker}
                  enabled={startTimeOptions.length > 0}
                  selectedValue={startMinuteOfDay}
                  dropdownIconColor={GREEN_DARK}
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
              </Field>
            </View>

            <Field label="Number of Hours" icon={<ClockIcon size={21} />}>
              <Picker
                style={styles.picker}
                selectedValue={lengthHours}
                dropdownIconColor={GREEN_DARK}
                onValueChange={(value) => setLengthHours(Number(value))}
              >
                {LENGTH_OPTIONS.map((hours) => (
                  <Picker.Item
                    key={hours}
                    label={String(hours)}
                    value={hours}
                  />
                ))}
              </Picker>
            </Field>

            <Pressable
              accessibilityRole="button"
              disabled={submitting || startTimeOptions.length === 0}
              onPress={submitRequest}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                (submitting || startTimeOptions.length === 0) &&
                  styles.submitButtonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <CalendarIcon size={22} color="#ffffff" />
                  <Text style={styles.submitButtonText}>
                    Submit Sitter Request
                  </Text>
                </>
              )}
            </Pressable>

            <View style={styles.securityRow}>
              <ShieldCheckIcon />
              <Text style={styles.securityText}>
                Your information is secure and only shared with approved
                sitters.
              </Text>
            </View>
          </View>

          <View
            style={[styles.summaryCard, isMobile && styles.summaryCardMobile]}
          >
            <Text style={styles.summaryTitle}>Pricing Summary</Text>

            <View style={styles.summaryRule} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base (first 2 hours)</Text>
              <Text style={styles.summaryValue}>$20</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Additional Hours</Text>
              <Text style={styles.summaryValue}>
                {extraHours} × ${hourlyRate}
              </Text>
            </View>

            <View style={styles.summaryRule} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${price}</Text>
            </View>

            <Text style={styles.explanation}>
              $20 for the first 2 hours + ${hourlyRate} for each additional{" "}
              {animal} hour.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: BACKGROUND,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 1040,
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    shadowColor: "#0f2814",
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardMobile: {
    padding: 18,
    borderRadius: 16,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  headingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headingCopy: {
    flex: 1,
  },
  title: {
    color: TEXT,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 3,
    color: TEXT_MUTED,
    fontSize: 16,
    lineHeight: 22,
  },
  errorBanner: {
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#efb1b1",
    backgroundColor: "#fff3f3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    flex: 1,
    color: ERROR,
    fontSize: 14,
    fontWeight: "600",
  },
  errorDismiss: {
    marginLeft: 12,
    color: ERROR,
    fontSize: 13,
    fontWeight: "700",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 28,
  },
  contentColumn: {
    flexDirection: "column",
    gap: 20,
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
  },
  fullWidth: {
    width: "100%",
  },
  field: {
    width: "100%",
    marginBottom: 17,
  },
  label: {
    marginBottom: 8,
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },
  control: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: GREEN,
    borderRadius: 10,
    backgroundColor: SURFACE,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  controlIcon: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  controlContent: {
    flex: 1,
    minWidth: 0,
  },
  textInput: {
    width: "100%",
    height: 54,
    paddingRight: 14,
    color: TEXT,
    fontSize: 16,
    outlineStyle: Platform.OS === "web" ? "none" : undefined,
  } as any,
  picker: {
    width: "100%",
    height: 54,
    color: TEXT,
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 16,
  },
  splitRow: {
    flexDirection: "row",
    gap: 16,
  },
  splitRowMobile: {
    flexDirection: "column",
    gap: 0,
  },
  splitField: {
    flex: 1,
    minWidth: 0,
  },
  submitButton: {
    minHeight: 58,
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: GREEN_DARK,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  submitButtonPressed: {
    backgroundColor: GREEN_DARK,
    transform: [{ scale: 0.995 }],
  },
  submitButtonDisabled: {
    opacity: 0.58,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  securityRow: {
    marginTop: 13,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  securityText: {
    flex: 1,
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
  },
  summaryCard: {
    width: 320,
    padding: 22,
    borderWidth: 1,
    borderColor: GREEN_BORDER,
    borderRadius: 14,
    backgroundColor: "#fbfdfb",
  },
  summaryCardMobile: {
    width: "100%",
  },
  summaryTitle: {
    color: GREEN_DARK,
    fontSize: 19,
    fontWeight: "700",
  },
  summaryRule: {
    height: 1,
    marginVertical: 16,
    backgroundColor: GREEN_BORDER,
  },
  summaryRow: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  summaryLabel: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
  },
  summaryValue: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "700",
  },
  totalValue: {
    color: GREEN,
    fontSize: 32,
    fontWeight: "800",
  },
  explanation: {
    marginTop: 16,
    color: TEXT_MUTED,
    fontSize: 13,
    lineHeight: 19,
  },
});
