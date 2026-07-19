const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

/** Sortable key: year * 100 + month (1–12). */
export function parseContentDate(date: string): number {
  const trimmed = date.trim();
  if (!trimmed) return 0;

  const target = trimmed.match(/^(\d{4})\s+Target$/i);
  if (target) return Number(target[1]) * 100 + 12;

  const monYear = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monYear) {
    const m = MONTHS[monYear[1].toLowerCase().slice(0, 3)];
    return Number(monYear[2]) * 100 + (m ?? 6);
  }

  const yearOnly = trimmed.match(/^(\d{4})$/);
  if (yearOnly) return Number(yearOnly[1]) * 100 + 6;

  return 0;
}

export function compareDateDesc(a: string, b: string): number {
  return parseContentDate(b) - parseContentDate(a);
}

export function compareDateAsc(a: string, b: string): number {
  return parseContentDate(a) - parseContentDate(b);
}

/** Current calendar month + next month (system date). */
export function isNearTermDate(date: string, now = new Date()): boolean {
  const key = parseContentDate(date);
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const thisMonth = y * 100 + m;
  const nextMonth = m === 12 ? (y + 1) * 100 + 1 : y * 100 + (m + 1);
  return key === thisMonth || key === nextMonth;
}

/** Publications: prefer month hints in venue, else year. */
export function publicationSortKey(pub: { year: string; venue: string }): number {
  const fromVenue = pub.venue.match(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+(\d{4})/i,
  );
  if (fromVenue) {
    return parseContentDate(`${fromVenue[1]} ${fromVenue[2]}`);
  }
  const targeting = pub.venue.match(/targeting\s+(\d{4})/i);
  if (targeting) return Number(targeting[1]) * 100 + 12;
  return parseContentDate(pub.year);
}
