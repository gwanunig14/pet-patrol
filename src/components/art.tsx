import React from "react";
import { Image } from "expo-image";
import Svg, { Circle, Line, Path, Rect, type SvgProps } from "react-native-svg";
import { type ImageStyle, type StyleProp } from "react-native";

const GREEN = "#1f8f2b";
const GREEN_DARK = "#10641d";
const PAPER = "#fbfcfa";

type IconProps = SvgProps & {
  size?: number;
  color?: string;
};

type PetProps = SvgProps & {
  size?: number;
  background?: boolean;
};

const DogImage = require("../../assets/images/DogImage.png");
const PigImage = require("../../assets/images/PigImage.png");
const CatImage = require("../../assets/images/CatImage.png");
const TrioImage = require("../../assets/images/TrioImage.png");

function IconFrame({
  size = 24,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {children}
    </Svg>
  );
}

export function ShieldCheckIcon({
  size = 18,
  color = GREEN,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.8 20 5.5v6.3c0 4.5-2.9 8.2-8 10.5-5.1-2.3-8-6-8-10.5V5.5L12 2.8Z"
        fill={color}
      />
      <Path
        d="m8.4 12 2.2 2.2 4.8-5"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ShieldPawIcon({
  size = 32,
  color = GREEN,
  ...props
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      {/* Rounded protective shield */}
      <Path
        d="
          M16 2.5
          C19.3 4.3 23.1 5.4 27.2 5.8
          V14.4
          C27.2 20.9 23.1 26.2 16 29.5
          C8.9 26.2 4.8 20.9 4.8 14.4
          V5.8
          C8.9 5.4 12.7 4.3 16 2.5
          Z
        "
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Very subtle shield highlight */}
      <Path
        d="
          M8.1 8
          C11 7.5 13.7 6.7 16 5.5
          C18.3 6.7 21 7.5 23.9 8
        "
        stroke={PAPER}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={0.16}
      />

      {/* Four paw toes */}
      <Circle cx="10.7" cy="13.4" r="1.85" fill={PAPER} />
      <Circle cx="13.8" cy="10.3" r="1.75" fill={PAPER} />
      <Circle cx="18.2" cy="10.3" r="1.75" fill={PAPER} />
      <Circle cx="21.3" cy="13.4" r="1.85" fill={PAPER} />

      {/* Main paw pad */}
      <Path
        d="
          M10.7 19.4
          C10.7 16.4 13.1 14.1 16 14.1
          C18.9 14.1 21.3 16.4 21.3 19.4
          C21.3 22.1 19.3 23.7 16 23.7
          C12.7 23.7 10.7 22.1 10.7 19.4
          Z
        "
        fill={PAPER}
      />
    </Svg>
  );
}

export function PawIcon({ size = 24, color = GREEN, ...props }: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Circle cx="6.8" cy="8.2" r="2.15" fill={color} />
      <Circle cx="10.4" cy="5.5" r="2.05" fill={color} />
      <Circle cx="13.6" cy="5.5" r="2.05" fill={color} />
      <Circle cx="17.2" cy="8.2" r="2.15" fill={color} />

      <Path
        d="
          M5.8 16.8
          C5.8 13.5 8.6 10.8 12 10.8
          C15.4 10.8 18.2 13.5 18.2 16.8
          C18.2 19.8 15.9 21.5 12 21.5
          C8.1 21.5 5.8 19.8 5.8 16.8
          Z
        "
        fill={color}
      />
    </IconFrame>
  );
}

export function UserIcon({
  size = 24,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Circle cx="12" cy="8" r="3.75" stroke={color} strokeWidth="1.8" />
      <Path
        d="M4.75 20.25C5.8 16.7 8.35 14.75 12 14.75s6.2 1.95 7.25 5.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  );
}

export function LockIcon({
  size = 24,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Path
        d="M7.75 10V8.25a4.25 4.25 0 0 1 8.5 0V10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <Rect
        x="5.25"
        y="10"
        width="13.5"
        height="10.5"
        rx="2.4"
        stroke={color}
        strokeWidth="1.8"
      />

      <Circle cx="12" cy="14.9" r="1.25" fill={color} />

      <Path
        d="M12 16v1.9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  );
}

export function EyeIcon({
  size = 24,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Path
        d="
          M2.75 12
          C4.8 8.55 7.85 6.75 12 6.75
          C16.15 6.75 19.2 8.55 21.25 12
          C19.2 15.45 16.15 17.25 12 17.25
          C7.85 17.25 4.8 15.45 2.75 12
          Z
        "
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <Circle cx="12" cy="12" r="2.8" stroke={color} strokeWidth="1.8" />
    </IconFrame>
  );
}

export function EyeOffIcon({
  size = 24,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Path
        d="M4.2 8.4C3.6 9.1 3.1 10 2.75 12c2.05 3.45 5.1 5.25 9.25 5.25 1.35 0 2.55-.2 3.65-.6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M8.3 7.2A10.4 10.4 0 0 1 12 6.75c4.15 0 7.2 1.8 9.25 5.25a11.4 11.4 0 0 1-2.2 2.7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M9.5 9.5A3.5 3.5 0 0 0 14.5 14.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <Path
        d="M4 4 20 20"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconFrame>
  );
}

export function CalendarIcon({
  size = 24,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Rect
        x="3.75"
        y="5.25"
        width="16.5"
        height="15"
        rx="2.5"
        stroke={color}
        strokeWidth="1.8"
      />

      <Line
        x1="3.75"
        y1="9.25"
        x2="20.25"
        y2="9.25"
        stroke={color}
        strokeWidth="1.8"
      />

      <Line
        x1="8"
        y1="3.75"
        x2="8"
        y2="7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <Line
        x1="16"
        y1="3.75"
        x2="16"
        y2="7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <Circle cx="8" cy="13" r="1" fill={color} />
      <Circle cx="12" cy="13" r="1" fill={color} />
      <Circle cx="16" cy="13" r="1" fill={color} />
      <Circle cx="8" cy="17" r="1" fill={color} />
      <Circle cx="12" cy="17" r="1" fill={color} />
      <Circle cx="16" cy="17" r="1" fill={color} />
    </IconFrame>
  );
}

export function ClockIcon({
  size = 24,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.8" />

      <Path
        d="M12 7.5V12l3.4 2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconFrame>
  );
}

export function LogoutIcon({
  size = 24,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      {/* Door */}
      <Path
        d="M10.25 4.5H6.5A2 2 0 0 0 4.5 6.5v11a2 2 0 0 0 2 2h3.75"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrow shaft */}
      <Path
        d="M9.25 12h10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Arrow head */}
      <Path
        d="m16 8.75 3.25 3.25L16 15.25"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconFrame>
  );
}

export function ChevronDownIcon({
  size = 18,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} viewBox="0 0 20 20" {...props}>
      <Path
        d="m5.25 7.5 4.75 4.75 4.75-4.75"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconFrame>
  );
}

export function ChevronLeftIcon({
  size = 18,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} viewBox="0 0 20 20" {...props}>
      <Path
        d="M12.5 4.75 7.75 10l4.75 5.25"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconFrame>
  );
}

export function ChevronRightIcon({
  size = 18,
  color = GREEN_DARK,
  ...props
}: IconProps) {
  return (
    <IconFrame size={size} viewBox="0 0 20 20" {...props}>
      <Path
        d="M7.5 4.75 12.25 10 7.5 15.25"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconFrame>
  );
}

export function PlusIcon({ size = 18, color = GREEN, ...props }: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </IconFrame>
  );
}

export function CheckIcon({ size = 18, color = GREEN, ...props }: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Path
        d="m4.75 12.25 4.1 4.1L19.25 6"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconFrame>
  );
}

export function XIcon({ size = 18, color = "#e5484d", ...props }: IconProps) {
  return (
    <IconFrame size={size} {...props}>
      <Path
        d="m6 6 12 12M18 6 6 18"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </IconFrame>
  );
}

export function SparkleIcon({ size = 18, color = GREEN, ...props }: IconProps) {
  return (
    <IconFrame size={size} viewBox="0 0 20 20" {...props}>
      <Path
        d="
          M9.25 2.25
          C9.65 5.65 11.1 7.45 14.5 7.85
          C11.1 8.25 9.65 10.05 9.25 13.45
          C8.85 10.05 7.4 8.25 4 7.85
          C7.4 7.45 8.85 5.65 9.25 2.25
          Z
        "
        fill={color}
      />

      <Path
        d="
          M15.35 11.75
          C15.55 13.45 16.3 14.2 18 14.4
          C16.3 14.6 15.55 15.35 15.35 17.05
          C15.15 15.35 14.4 14.6 12.7 14.4
          C14.4 14.2 15.15 13.45 15.35 11.75
          Z
        "
        fill={color}
        opacity={0.62}
      />
    </IconFrame>
  );
}

function ImageArt({
  source,
  size,
  style,
}: {
  source: number;
  size: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={source}
      style={[{ width: size, height: size, alignSelf: "center" }, style]}
      contentFit="contain"
      transition={100}
    />
  );
}

function DogArt({ size = 140 }: PetProps & { mode?: "head" | "figure" }) {
  return <ImageArt source={DogImage} size={size} />;
}

function PigArt({ size = 140 }: PetProps & { mode?: "head" | "figure" }) {
  return <ImageArt source={PigImage} size={size} />;
}

function CatArt({ size = 140 }: PetProps & { mode?: "head" | "figure" }) {
  return <ImageArt source={CatImage} size={size} />;
}

export function DogHeadIllustration(props: PetProps) {
  return <DogArt {...props} mode="head" />;
}

export function PigHeadIllustration(props: PetProps) {
  return <PigArt {...props} mode="head" />;
}

export function CatHeadIllustration(props: PetProps) {
  return <CatArt {...props} mode="head" />;
}

export function PetAvatar({
  animal,
  size = 72,
}: {
  animal: "dog" | "pig" | "cat";
  size?: number;
}) {
  const common = { size, background: true };

  if (animal === "dog") return <DogHeadIllustration {...common} />;
  if (animal === "pig") return <PigHeadIllustration {...common} />;
  return <CatHeadIllustration {...common} />;
}

export function TrioIllustration({
  width = 520,
  height = 260,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      source={TrioImage}
      style={{ width, height, alignSelf: "center" }}
      contentFit="contain"
      transition={100}
    />
  );
}
