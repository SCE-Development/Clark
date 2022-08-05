import React from 'react';

import './About.css';

export default function AboutPage() {
  {/* eslint-disable-next-line */}
  let photos = ['https://user-images.githubusercontent.com/36345325/183006899-43dd8a1d-748c-414d-9643-81fc420d6f6a.png',
    {/* eslint-disable-next-line */},
    'https://user-images.githubusercontent.com/36345325/183006944-9ac31633-3651-41e7-95f2-36470cd2fb79.png',
    {/* eslint-disable-next-line */},
    'https://user-images.githubusercontent.com/36345325/183007229-cf4719cb-c608-465d-a586-22a01c9d402b.png',
    {/* eslint-disable-next-line */},
    'https://user-images.githubusercontent.com/36345325/183007349-2717ab80-ab83-4f24-8c54-35d8fc99b945.png',
    {/* eslint-disable-next-line */},
    'https://user-images.githubusercontent.com/36345325/183007397-903b28d0-7519-4c09-a820-54884c385108.png',
    {/* eslint-disable-next-line */},
    'https://user-images.githubusercontent.com/36345325/183007498-b9a87fc6-8f62-47bb-8518-4dfefa4c1060.png'
  ];
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
          {photos.map((photo, index) => (
            <img className = 'img-size' src={photo} alt = "scephoto" />
          ))}
        </div>
      </div>
    </>
  );
}
