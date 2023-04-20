import React, { useState } from 'react';
import { Row } from 'reactstrap';
import './ProjectsFooter.css';
import DiscordIcon from './Icons/DiscordIcon';
import InstagramIcon from './Icons/InstagramIcon';
import GitHubIcon from './Icons/GitHubIcon';

export default () => {
    return (
    <>
      <footer className='footer-wrap bg-dark text-white p-4'>
        <Row  className='footer-text align-items-center justify-content-center'>
          <div className='social-media'>
            <DiscordIcon/>
            <InstagramIcon/>
            <GitHubIcon/>
          </div>
          <p
            id='footer-note'
            style={{marginTop: '1rem', fontSize: '0.8rem'}}>
              Brought to you by SCE Dev-Team
          </p>
        </Row>
      </footer>
    </>
  );
};
