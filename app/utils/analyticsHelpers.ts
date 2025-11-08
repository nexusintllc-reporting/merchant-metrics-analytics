import { cacheManager } from './cacheManager';

export function makeCacheKey(shop: string, segment: string): string {
  return `${shop}::analytics::${segment}::v${cacheManager.version}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function getMonthRanges(shopTimeZone: string = "UTC") {
  const ranges: { start: string; end: string; key: string }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    ranges.push({
      start: start.toISOString(),
      end: end.toISOString(),
      key: date.toLocaleString("default", { month: "short", year: "numeric" }),
    });
  }

  return ranges;
}

export function getLastNDays(n: number, shopTimeZone: string = "UTC") {
  const days: string[] = [];
  const now = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayKey = d.toLocaleDateString("en-CA", { timeZone: shopTimeZone });
    days.push(dayKey);
  }
  
  return days;
}

export function getLast8Weeks(shopTimeZone: string = "UTC") {
  const weeks: string[] = [];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  for (let i = 7; i >= 0; i--) {
    const startOfWeek = new Date(monday);
    startOfWeek.setDate(monday.getDate() - i * 7);
    const key = `Week of ${startOfWeek.toLocaleDateString("en-CA", { timeZone: shopTimeZone })}`;
    weeks.push(key);
  }
  return weeks;
}

export function formatWeekDisplay(weekKey: string): string {
  if (weekKey.startsWith('Week of ')) {
    const dateStr = weekKey.replace('Week of ', '');
    const startOfWeek = new Date(dateStr + 'T00:00:00');
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleDateString("en-US", { month: "short" });
    const startDay = startOfWeek.getDate();
    const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });
    const endDay = endOfWeek.getDate();
    
    return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
  }
  return weekKey;
}