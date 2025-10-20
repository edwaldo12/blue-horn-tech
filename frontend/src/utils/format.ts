import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (input: string | Date): string =>
  dayjs(input).format('ddd, DD MMMM YYYY');

export const formatTime = (input: string | Date): string =>
  dayjs(input).format('HH:mm');

export const formatTimeRange = (start: string, end: string): string =>
  `${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`;

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hrs} hour${hrs > 1 ? 's' : ''}` : `${hrs}h ${mins}m`;
};

export const formatRelative = (input: string): string => dayjs(input).fromNow();
