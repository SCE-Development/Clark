import React from 'react';
import './ProjectsHeader.css';
import { Button } from 'reactstrap';

export default function ProjectHeader() {
  return (
    <div className='projects-header'>
      <div className='text-header'>
        <b>Our Projects</b>
        <Button outline color='primary' id='btn' href='https://github.com/SCE-Development'
          style={{width:'170px', border:'3px solid', borderRadius:8, fontSize:'20px'}}>
            GitHub
        </Button>
        <hr />
        <div className='text-header-box'>
          <p>
              Spanning various disciples throughout across software and
              computer engineering, these projects display the collaborative creations
              of SCE's engineers for SJSU students and community members alike.
          </p>
        </div>
      </div>
    </div>
  );
}
