import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration?: number) {
  if (!duration) return '--:--:--';

  const round = Math.round(duration);
  var hours = String(Math.floor(round / 3600));
  var minutes = String(Math.floor((round - Number(hours) * 3600) / 60));
  var seconds = String(round - Number(hours) * 3600 - Number(minutes) * 60);

  if (Number(hours) < 10) {
    hours = '0' + hours;
  }
  if (Number(minutes) < 10) {
    minutes = '0' + minutes;
  }
  if (Number(seconds) < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
}

export function formatDateTime(date: Date) {
  const currentDate = new Date();
}

export function createSlug(value: string) {
  return slugify(value, { lower: true, strict: true });
}

export function generateThumbnailUrl() {}

export function encodeCursor(rawCursor: string | number | null) {
  if (rawCursor === null || rawCursor === undefined) {
    return null;
  }
  const encoded = Buffer.from(String(rawCursor)).toString('base64');
  return encoded;
}

export function decodeCursor(encodedCursor: string | null) {
  if (encodedCursor === 'null' || encodedCursor === null || encodedCursor === undefined) {
    return null;
  }
  try {
    const decoded = Buffer.from(encodedCursor, 'base64').toString('utf8');
    // if (!isNaN(Number(decoded)) && decoded.trim() !== '') {
    //   return Number(decoded);
    // }
    return decoded;
  } catch (e) {
    console.error('Failed to decode cursor:', e);
    return null;
  }
}

export function formatDateForInput(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeForInput(timestamp: string): string {
  const date = new Date(timestamp);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}
