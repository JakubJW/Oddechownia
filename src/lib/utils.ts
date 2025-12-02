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

export const formatTime = (date: string) => {
  return new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

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
  if (
    encodedCursor === 'null' ||
    encodedCursor === null ||
    encodedCursor === undefined
  ) {
    return null;
  }
  try {
    const decoded = Buffer.from(encodedCursor, 'base64').toString('utf8');
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

export function hexToHSL(hex: string) {
  hex = hex.replace(/^#/, '');

  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hexToTailwindHSL(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  return `${h}, ${s}%, ${l}%`;
}
