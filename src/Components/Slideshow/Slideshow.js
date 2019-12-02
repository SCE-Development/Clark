import React, { Component } from 'react'
import {
  Carousel,
  CarouselItem,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators
} from 'reactstrap'
import './Slideshow.css'

const items = [
  {
    id: 0,
    src: 'images/officers2019.jpg',
    altText: 'Officers',
    header: '2019-2020 Officers',
    caption: '',
    top: '25%'
  },
  {
    id: 1,
    src: 'images/funnyofficers.jpg',
    altText: 'Officers',
    header: '2019-2020 Officers',
    caption: '',
    top: '25%'
  },
  {
    id: 2,
    src: 'images/Tesla2.jpg',
    altText: 'Tesla Visit',
    header: 'Tesla Tour',
    caption: '',
    top: '60%'
  },
  {
    id: 3,
    src: 'images/meeting2.jpg',
    altText: 'SCE General Meeting',
    header: 'General Meeting',
    caption: '',
    top: '40%'
  },
  {
    id: 4,
    src: 'images/sap.jpg',
    altText: 'SAP Tour',
    header: 'Company Tour',
    caption: '',
    top: '65%'
  },
  {
    id: 5,
    src: 'images/react.jpg',
    altText: 'React Workshop',
    header: 'React Workshop',
    caption: '',
    top: '40%'
  },
  {
    id: 6,
    src: 'images/chess.jpg',
    altText: 'Game Night!',
    header: 'Game Night',
    caption: '',
    top: '60%'
  },
  {
    id: 7,
    src: 'images/making-cake.jpg',
    altText: 'Cake Team Building',
    header: 'Cake Team Building',
    caption: '',
    top: '40%'
  }
  /* Can add more images below as needed, or use Facebook API in the future to auto load images */
  /* Images must be 16:9 or 4:3 with minimum width of 1000 px */
]

class Slideshow extends Component {
  constructor (props) {
    super(props)
    this.state = { activeIndex: 0 }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.onNext = this.handleNext.bind(this)
    this.onPrevious = this.handlePrevious.bind(this)
    this.handleGoToIndex = this.handleGoToIndex.bind(this)
    this.handleOnExiting = this.handleOnExiting.bind(this)
    this.handleOnExited = this.handleOnExited.bind(this)
  }

  handleOnExiting () {
    this.animating = true
  }

  handleOnExited () {
    this.animating = false
  }

  onNext () {
    this.handleNext()
  }

  onPrevious () {
    this.handlePrevious()
  }

  handleNext () {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === items.length - 1
        ? 0
        : this.state.activeIndex + 1
    this.setState({ activeIndex: nextIndex })
  }

  handlePrevious () {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === 0
        ? items.length - 1
        : this.state.activeIndex - 1
    this.setState({ activeIndex: nextIndex })
  }

  handleGoToIndex (newIndex) {
    if (this.animating) return
    this.setState({ activeIndex: newIndex })
  }

  render () {
    const { activeIndex } = this.state

    const slides = items.map((item, index) => {
      return (
        <CarouselItem
          id={'caption-' + index}
          className='slideshow text-center'
          tag='div'
          key={item.id}
          onExiting={this.handleOnExiting}
          onExited={this.handleOnExited}
        >
          <img
            src={item.src}
            alt={item.altText}
            className='carousel-images img-fluid'
            style={{ top: item.top }}
          />
          <CarouselCaption
            captionText={item.caption}
            captionHeader={item.header}
          />
        </CarouselItem>
      )
    })

    return (
      <div id='clicker'>
        <style>
          {`.slideshow {
                align-items: center;
                height: 94vh;
              }`}
        </style>
        <Carousel
          activeIndex={activeIndex}
          next={this.onNext}
          previous={this.onPrevious}
        >
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={this.handleGoToIndex}
          />
          {slides}
          <CarouselControl
            direction='prev'
            directionText='Previous'
            onClickHandler={this.handlePrevious}
          />
          <CarouselControl
            direction='next'
            directionText='Next'
            onClickHandler={this.handleNext}
          />
        </Carousel>
      </div>
    )
  }
}

export default Slideshow
