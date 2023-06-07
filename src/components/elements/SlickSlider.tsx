/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo } from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/components/_Slickslider.scss';

interface SliderProps {
  children: React.ReactNode;
  id: string;
  loop: boolean;
  slidesToShow: number;
  slidesToScroll: number;
  arrows: boolean;
}

function SlickSlider({
  children,
  id,
  loop = false,
  slidesToShow,
  slidesToScroll,
  arrows = false,
}: SliderProps) {
  const settings: Settings = useMemo<Settings>(
    () => ({
      dots: false,
      slidesToShow,
      slidesToScroll,
      infinite: loop,
      arrows,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
          },
        },
      ],
    }),
    [arrows, loop, slidesToShow, slidesToScroll]
  );
  return (
    <div id={id}>
      <Slider
        dots={settings.dots}
        slidesToShow={settings.slidesToShow}
        slidesToScroll={settings.slidesToScroll}
        infinite={settings.infinite}
        arrows={settings.arrows}
        responsive={settings.responsive}
      >
        {children}
      </Slider>
    </div>
  );
}

export default SlickSlider;
