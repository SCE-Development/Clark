import React from 'react';

import './About.css';

export default function AboutPage() {
  return (
    <>
      <div className='about-bg'>
        <div className='about-header'>
          <h1> The Next Frontier of Innovation at San Jose State</h1>
        </div>
        <div className='about-text'>
          <h3>
            The Software and Computer Engineering Society aims
            to provide students with sense of community, industry-relevant
            experience and mentorship.
          </h3>
        </div>
        <div className='about-flexbox-img'>
          {/* eslint-disable-next-line */}
          <img className = 'img-size' src= 'https://www.thespruce.com/thmb/2fz1zlPNq7cj7QkLAtKdqYrKvs0=/3704x2778/smart/filters:no_upscale()/the-difference-between-trees-and-shrubs-3269804-hero-a4000090f0714f59a8ec6201ad250d90.jpg' alt="Sixnine" />
          {/* eslint-disable-next-line */}
          <img className = 'img-size' src= 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX5188613.jpg' alt="Sixnine" />
          {/* eslint-disable-next-line */}
          <img className = 'img-size' src= 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX5188613.jpg' alt="Sixnine" />
          {/* eslint-disable-next-line */}
          <img className = 'img-size' src= 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX5188613.jpg' alt="Sixnine" />
        </div>
      </div>
    </>
  );
}
