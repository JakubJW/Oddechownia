import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  var hours = String(Math.floor(duration / 3600));
  var minutes = String(Math.floor((duration - Number(hours) * 3600) / 60));
  var seconds = String(duration - Number(hours) * 3600 - Number(minutes) * 60);

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

export function createSlug(value: string) {
  return slugify(value, { lower: true, strict: true });
}
