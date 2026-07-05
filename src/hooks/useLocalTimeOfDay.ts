import { useMemo } from "react";

export type TimeOfDay = "day" | "night";

export function resolveLocalTimeOfDay(date = new Date()): TimeOfDay {
  const hour = date.getHours();
  return hour >= 19 || hour < 6 ? "night" : "day";
}

export function resolveLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export default function useLocalTimeOfDay(): {
  timeOfDay: TimeOfDay;
  timeZone: string;
} {
  return useMemo(
    () => ({
      timeOfDay: resolveLocalTimeOfDay(),
      timeZone: resolveLocalTimeZone(),
    }),
    [],
  );
}
