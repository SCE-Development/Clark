import React from 'react';
import './WhatWeDo.css';
import { Button } from 'reactstrap';

const WhatWeDo = () => {
  return (
    <div className='what-we-do'>
      <div className='container-what-we-do'>
        <div className='what-we-do-img'>
          <img
            src="images/what-we-do-image.jpg"
            alt="SCE What We Do"
            className='hide-images'
          />
        </div>
        <div className='what-we-do-p'>
          <div className='what-we-do-header'>
            <h1 >What We Do</h1>
          </div>
          <p className='what-we-do-content'>
            SCE provides a social space for students to congregate and
            collaborate. We encourage members to connect and make new
            friends through social events such as potlucks, game nights,
            and movie nights. We also wish for members to facilitate
            connections, not only personally, but also professionally.
            Throughout the years, SCE has hosted networking/recruiting
            events and company tours with Tesla, Cisco, SAP, Capital One,
            Texas Instruments, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
