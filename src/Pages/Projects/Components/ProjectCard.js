import React from 'react';
import './ProjectCard.css';

export default function ProjectCard({link, image, name, subnote, caption}) {
  return (
    <>
      <div className='project-box'>
        <a href={link} target="_blank">
          <img className='project-photo' src={image} alt="Project Picture" />
        </a>
        <p className='project-name'>
          {name}
          <span className='project-subnote'>{subnote}</span>
        </p>
        <p className='project-caption'>
          {caption}
        </p>
      </div>
    </>
  );
}
