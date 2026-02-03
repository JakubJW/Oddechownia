'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider, { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const defaultSettings: Settings = {
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
  settings,
}: {
  children: React.ReactNode;
  settings?: Settings;
  hideArrows?: boolean;
}) {
  const slider = useRef<Slider>(null);
  const sliderSettings = { ...defaultSettings, ...settings };

  return (
    <div className="slider-container relative">
      <button
        className="slider-arrow-button slider-arrow-button__left"
        onClick={() => slider.current?.slickPrev()}
      >
        <ChevronLeft className="slider-arrow-icon" />
      </button>
      <Slider
        ref={slider}
        className="-mx-4"
        {...sliderSettings}
      >
        {children}
      </Slider>
      <button
        className="slider-arrow-button slider-arrow-button__right"
        onClick={() => slider.current?.slickNext()}
      >
        <ChevronRight className="slider-arrow-icon" />
      </button>
    </div>
  );
}
