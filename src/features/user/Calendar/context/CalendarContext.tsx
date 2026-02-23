'use client';

import { createContext, useContext } from 'react';
import { LiveLessonEvent } from '@/entities/models/user-practice-schedule';

interface CalendarContextType {
  onSignUp: (lesson: LiveLessonEvent) => void;
  // You can add more actions here later, e.g., onEdit, onDelete
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarGrid');
  }
  return context;
};

export const CalendarProvider = CalendarContext.Provider;
