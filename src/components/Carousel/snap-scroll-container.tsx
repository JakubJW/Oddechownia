'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const SnapScrollContainer = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-6 relative">
      <div
        ref={scrollRef}
        className="-mx-4 lg:-mx-0 lg:gap-4 flex justify-start overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-4"
      >
        {children}
      </div>

      <button
        className="hidden lg:block slider-arrow-button slider-arrow-button__left"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="slider-arrow-icon" />
      </button>
      <button
        className="hidden lg:block slider-arrow-button slider-arrow-button__right"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="slider-arrow-icon" />
      </button>
    </div>
  );
};

export default SnapScrollContainer;
