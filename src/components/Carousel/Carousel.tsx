'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Info } from 'lucide-react';

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  arrows: false,
  responsive: [
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
      },
    },
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
      },
    },
  ],
};

export default function Carousel({
  children,
}: React.PropsWithChildren<object>) {
  const slider = useRef<Slider>(null);

  return (
    <div className="slider-container relative">
      <button
        className="hidden lg:block lg:absolute slider-arrow-button slider-arrow-button__left"
        onClick={() => slider.current?.slickPrev()}
      >
        <ChevronLeft className="slider-arrow-icon" />
      </button>
      <Slider
        className="lg:mx-12"
        ref={slider}
        {...settings}
      >
        {children}
      </Slider>
      <button
        className="hidden lg:block lg:absolute slider-arrow-button slider-arrow-button__right"
        onClick={() => slider.current?.slickNext()}
      >
        <ChevronRight className="slider-arrow-icon" />
      </button>
      <div className="lg:hidden flex gap-2 items-center">
        <button
          className="slider-arrow-button translate-y-0 static slider-arrow-button__left"
          onClick={() => slider.current?.slickPrev()}
        >
          <ChevronLeft className="slider-arrow-icon" />
        </button>
        <button
          className="slider-arrow-button static translate-y-0 slider-arrow-button__right"
          onClick={() => slider.current?.slickNext()}
        >
          <ChevronRight className="slider-arrow-icon" />
        </button>
        <div className="flex items-center text-muted-foreground text-sm">
          Użyj strzałek lub przesuń w bok, aby przewinąć
        </div>
      </div>
    </div>
  );
}
