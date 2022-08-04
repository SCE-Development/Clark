import React, { useState, Component } from 'react';
import Footer from '../../Components/Footer/Footer.js';
import './DevTeamCSS.css';
import { Button } from 'reactstrap';
import { paragraph1, paragraph2, paragraph3 } from './content.json';
import image1 from './images/img-1.jpg';
import image2 from './images/img-2.jpg';
import image3 from './images/img-3.jpg';

export default function DevTeam() {
  function truncate(str){
    const text = str;
    const [isShowLess, setIsShowLess] = useState(true);
    const result = isShowLess ? text.slice(0, 200) : text;
    const styleReadButton = {
      color: '#0d6efd',
      textDecoration: 'underline'
    };
    const toggleIsShow = () => {
      setIsShowLess(!isShowLess);
    };

    return (
      <p>
        {result}
        <span> </span>
        <span
          onClick={toggleIsShow}
          style = {styleReadButton}
          className='readmore-btn'>
          {isShowLess ? 'Read more >>' : 'Read less <<'}
        </span>
      </p>
    );
  }

  return (
    <>
      <div className='main'>
        <div className='page-title'>
          <p>We Are SCE Development Team</p>
          <div className='border'></div>
        </div>
        <div className='page-content'>
          <div className='intro-div'>
            {truncate(paragraph1)}
            {truncate(paragraph2)}
            {truncate(paragraph3)}
          </div>
          <div className='button-div'>
            <a href='https://github.com/SCE-Development' target="_blank">
              <Button
                outline color="primary"
                className='project-btn'
              >Projects</Button>
            </a>
          </div>
          <div className = 'image-div'>
            <img className = 'img1' src = { image1 } />
            <img className = 'img2' src = { image2 } />
            <img className = 'img3' src = { image3 } />
          </div>

        </div>
        <Footer />
      </div>
    </>

  );
}
