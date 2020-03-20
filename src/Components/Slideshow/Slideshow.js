import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators
} from 'reactstrap';
import './slideshow.css';

const items = [
  {
    src: 'images/officers2019.jpg',
    altText: 'Officers',
    header: '2019-2020 Officers',
    top: '25%'
  },
  {
    src: 'images/funnyofficers.jpg',
    altText: 'Officers',
    header: '2019-2020 Officers',
    top: '25%'
  },
  {
    src: 'images/Tesla2.jpg',
    altText: 'Tesla Visit',
    header: 'Tesla Tour',
    top: '60%'
  },
  {
    src: 'images/meeting2.jpg',
    altText: 'SCE General Meeting',
    header: 'General Meeting',
    top: '40%'
  },
  {
    src: 'images/sap.jpg',
    altText: 'SAP Tour',
    header: 'Company Tour',
    top: '65%'
  },
  {
    src: 'images/react.jpg',
    altText: 'React Workshop',
    header: 'React Workshop',
    top: '40%'
  },
  {
    src: 'images/chess.jpg',
    altText: 'Game Night!',
    header: 'Game Night',
    top: '60%'
  },
  {
    src: 'images/making-cake.jpg',
    altText: 'Cake Team Building',
    header: 'Cake Team Building',
    top: '40%'
  }
  /* Can add more images below as needed, or use Facebook
   API in the future to auto load images */
  /* Images must be 16:9 or 4:3 with minimum width of 1000 px */
];

function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  function handleNext() {
    if (animating) return;
    const nextIndex = (currentSlide + 1) % items.length;
    setCurrentSlide(nextIndex);
  }

  function positiveMod(a, b) {
    return a < 0 ? b - 1 : a % b;
  }

  function handlePrevious() {
    if (animating) return;
    const nextIndex = positiveMod(currentSlide - 1, items.length);
    setCurrentSlide(nextIndex);
  }

  function handleGoToIndex(newIndex) {
    if (animating) return;
    setCurrentSlide(newIndex);
  }

  return (
    <div id='clicker'>
      <Carousel
        activeIndex={currentSlide}
        next={handleNext}
        previous={handlePrevious}
      >
        <CarouselIndicators
          items={items}
          activeIndex={currentSlide}
          onClickHandler={handleGoToIndex}
        />
        {items.map((item, index) => {
          return (
            <CarouselItem
              id={'caption-' + index}
              className='slideshow text-center'
              tag='div'
              key={index}
              onExiting={() => setAnimating(true)}
              onExited={() => setAnimating(false)}
            >
              <img
                src={item.src}
                alt={item.altText}
                className='carousel-images img-fluid'
                style={{ top: item.top }}
              />
              <CarouselCaption captionText=' ' captionHeader={item.header} />
            </CarouselItem>
          );
        })}
        <CarouselControl
          direction='prev'
          directionText='Previous'
          onClickHandler={handlePrevious}
        />
        <CarouselControl
          direction='next'
          directionText='Next'
          onClickHandler={handleNext}
        />
      </Carousel>
    </div>
  );
}
export default Slideshow;
