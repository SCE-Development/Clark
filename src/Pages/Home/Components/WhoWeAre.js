import React from 'react';
import './WhoWeAre.css';
import { Button } from 'reactstrap';

const WhoWeAre = () => {
  let whoWeAre = 'https://user-images.githubusercontent.com' +
    '/63530023/230752231-dcc68c0e-e3de-488c-8274-b02ce1d09ba6.png';
  return (
    <div className="who-we-are">
      <div className="container-who-we-are">
        <div className="who-we-are-p">
          <div className="who-we-are-header">
            <h1>Who We Are</h1>
          </div>
          <p className='who-we-are-content'>
            The mission of the Software and Computer Engineering Society (SCE)
            is two-fold: making valuable connections and building technical
            skills. As the largest engineering club at SJSU, SCE strives for the
            success of Computer Engineering (CMPE) and Software Engineering (SE)
            students, though we are open to all majors, ranging from other types
            of engineering to design. As a student-run organization, our alumni
            network stretches to Google, Apple, Meta, HP, and many more.
          </p>
          <div className="join-sce-button who-we-are-content">

          </div>
        </div>
        <div className="who-we-are-img">
          <img className='image'
            src={whoWeAre}
            alt="SCE Who We Are" />
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
