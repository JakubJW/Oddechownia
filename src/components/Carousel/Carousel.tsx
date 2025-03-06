'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export default function Carousel({
  children,
}: React.PropsWithChildren<object>) {
  const slider = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="slider-container relative">
      <button
        className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-primaryBg rounded-full"
        onClick={() => slider.current?.slickPrev()}
      >
        <ChevronLeft className="text-primaryFg" />
      </button>
      <Slider
        className="lg:mx-24"
        ref={slider}
        {...settings}
      >
        {children}
      </Slider>
      <button
        className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-primaryBg rounded-full"
        onClick={() => slider.current?.slickNext()}
      >
        <ChevronRight className="text-primaryFg" />
      </button>
    </div>
  );
}
