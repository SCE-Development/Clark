import React, { useState } from 'react';
import './Gallery.css';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const CarouselSlider = (props) => {

  const items = props.carouselPics.map((pic, index) => {
    return (
      {
        src: pic,
        altText: 'slide ' + (index + 1)
      }
    );
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const length = props.carouselPics.length;

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)} key={item.src} >
        <img src={item.src} className="carouselImg" alt={item.altText} />
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous} >
      <CarouselIndicators items={items} activeIndex={activeIndex}
        onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous"
        onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next"
        onClickHandler={next} />
    </Carousel>
  );
};

export default CarouselSlider;
