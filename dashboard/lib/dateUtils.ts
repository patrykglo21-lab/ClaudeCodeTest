export type DateRange = 'week' | 'month' | 'all';

export function getDateRange(range: DateRange): { start: Date | null; end: Date | null } {
  const now = new Date();

  if (range === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return { start, end: now };
  }

  if (range === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end: now };
  }

  return { start: null, end: null };
}

export function isWithinRange(dateStr: string, range: DateRange): boolean {
  const { start, end } = getDateRange(range);
  if (!start) return true;
  const date = new Date(dateStr);
  return date >= start && date <= end!;
}
