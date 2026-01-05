import moment from 'moment-timezone';
import { DEFAULT_TIMEZONE } from '../constants';

export const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const getDayOfWeekIndex = (day: string): number => {
  const normalizedDay = day.toLowerCase();
  return DAYS_OF_WEEK.indexOf(normalizedDay as DayOfWeek);
};

export const getNextOccurrenceOfDay = (dayOfWeek: string): Date => {
  const now = moment.tz(DEFAULT_TIMEZONE);
  const today = now.clone().startOf('day');

  const targetDayIndex = getDayOfWeekIndex(dayOfWeek);
  const currentDayIndex = today.day();

  const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;

  let nextDateInSydney;
  if (daysUntilTarget === 0) {
    nextDateInSydney = today.clone().add(7, 'days');
  } else {
    nextDateInSydney = today.clone().add(daysUntilTarget, 'days');
  }

  return nextDateInSydney.toDate();
};

export const getTimeRemaining = (
  targetDate: Date
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} => {
  const now = moment.tz(DEFAULT_TIMEZONE);
  const target = moment.tz(targetDate, DEFAULT_TIMEZONE);

  const diff = target.diff(now);

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  const duration = moment.duration(diff);
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return { days, hours, minutes, seconds, totalMs: diff };
};

export const formatCountdown = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): string => {
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};
