import React from 'react';
import './WhatWeDo.css';
import { Button } from 'reactstrap';

const WhatWeDo = () => {
  let whatWeDo = 'https://user-images.githubusercontent.com' +
    '/63530023/230752387-0e13522c-731b-4f7a-94ae-268f24ea0ddc.jpg';
  return (
    <div className='what-we-do'>
      <div className='container-what-we-do'>
        <div className='what-we-do-img'>
          <img
            src={whatWeDo}
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
