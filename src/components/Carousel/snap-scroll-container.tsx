'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const SnapScrollContainer = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Przesuwamy o szerokość jednego elementu lub całego kontenera
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="group relative">
      {/* Kontener Scrolla */}
      <div
        ref={scrollRef}
        className="flex justify-start overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth gap-4 pb-4"
      >
        {children}
      </div>

      {/* Strzałki (widoczne tylko na desktopie) */}
      <button
        className="slider-arrow-button slider-arrow-button__left"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="slider-arrow-icon" />
      </button>
      <button
        className="slider-arrow-button slider-arrow-button__right"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="slider-arrow-icon" />
      </button>
    </div>
  );
};

export default SnapScrollContainer;
