import React, { Component } from 'react';
import { Carousel, CarouselItem, CarouselCaption, CarouselControl, CarouselIndicators } from 'reactstrap';
import './Slideshow.css';

const items = [
  {
    id: 0,
    src: require('../../../assets/img/officer-photo-18.jpg'),
    altText: 'Officers',
    header: '',
    caption: '',
  },
  {
    id: 1,
    src: require('../../../assets/img/officer-photo-18-silly.jpg'),
    altText: 'Officers',
    header: '',
    caption: '',
  },
  {
    id: 2,
    src: require('../../../assets/img/club-award.jpg'),
    altText: 'Academic Club of the Year',
    header: 'Academic Club of the Year',
    caption: ''
  },
  {
    id: 3,
    src: require('../../../assets/img/workshops.jpg'),
    altText: 'Workshops',
    header: 'Workshops',
    caption: ''
  },
  {
    id: 4,
    src: require('../../../assets/img/facebook.jpg'),
    altText: 'Facebook tour',
    header: 'Facebook',
    caption: ''
  },
  {
    id: 5,
    src: require('../../../assets/img/pure-storage.jpg'),
    altText: 'Pure Storage',
    header: 'Pure Storage',
    caption: ''
  },
  {
    id: 6,
    src: require('../../../assets/img/resume-workshop.jpg'),
    altText: 'Resume Workshop',
    header: 'Resume Workshop',
    caption: ''
  },
  {
    id: 7,
    src: require('../../../assets/img/sce-pancakes.jpg'),
    altText: 'Pancakes',
    header: 'Pancakes!',
    caption: 'Every Thursday at 10am!'
  },
  {
    id: 8,
    src: require('../../../assets/img/sce-thanksgiving.jpg'),
    altText: 'Thanksgiving',
    header: 'Happy Thanksgiving from SCE!',
    caption: ''
  },
  /* Can add more images below as needed, or use Facebook API in the future to auto load images */
  /* Images must be 16:9 or 4:3 with minimum width of 1000 px */
];

class Slideshow extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;

    const slides = items.map((item) => {
      return (
        <CarouselItem
          className="slideshow text-center"
          tag="div"
          key={item.id}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <img src={item.src} alt={item.altText} className="carousel-images img-fluid"/>
          <CarouselCaption captionText={item.caption} captionHeader={item.header} />
        </CarouselItem>
      );
    });

    return (
      <div>
        <style>
          {
            `.slideshow {
                align-items: center;
                height: 94vh;
              }`
          }
        </style>
        <Carousel
          activeIndex={activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
          {slides}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
      </div>
    );
  }
}

export default Slideshow;
