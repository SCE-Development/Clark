import React from 'react';
import ProjectCard from './Components/ProjectCard';

const projects = [
  {
    'link': 'https://github.com/SCE-Development/Clark',
    'image': 'https://user-images.githubusercontent.com/59713070/235862105-9606e862-e27e-40d4-8991-de1793c48dd0.png',
    'name': 'Clark', 'subnote': '(formerly Core-v4)',
    'information': 'Full Stack',
    'caption': 'React, Express.js, and MongoDB; Clark is the club\'s website. It supports printing services for members and allows officers to control various devices in the clubroom.'
  },
  {
    'link': 'https://github.com/SCE-Development/rpi-led-controller',
    'image': 'https://user-images.githubusercontent.com/59713070/235859723-cdea1a8e-5698-40c2-9755-9ec2e40984cd.jpeg',
    'name': 'SCE Light-Emitting Display',
    'information': 'Interfacing RESTful APIs with Hardware',
    'caption': 'Produced as a part of our summer internship projects, SCE interns designed an officer-controlled illuminated sign, functioning to brighten the clubroom\'s atmosphere.'
  },
  {
    'link': 'https://github.com/SCE-Development/Clark',
    'image': 'https://github.com/user-attachments/assets/1637dc25-2073-43e5-a952-c1a3d50d16fe',
    'name': 'SCEta Transit',
    'information': 'Full Stack',
    'caption': 'SCETA Transit is a web application that provides real-time bus, Caltrain, and BART timing predictions for nearby stops.'
  },
  {
    'link': 'https://github.com/SCE-Development/Clark',
    'image': 'https://github.com/user-attachments/assets/204dc7d7-e7a1-4add-ae6b-37286ba1c510',
    'name': 'SCE Chatroom',
    'information': 'Full Stack',
    'caption': 'SCE\'s chatroom is a web application that allows members to communicate with each other in real-time.'
  },
  {
    'link': 'https://github.com/SCE-Development/cleezy',
    'image': 'https://github.com/user-attachments/assets/777307da-36b0-4255-a77d-87651bb253d1',
    'name': 'Cleezy',
    'information': 'FastAPI',
    'caption': 'A url shortening service created by SCE'
  },
];

export default function ProjectsPage() {
  return (
    <div className="dark:bg-gray-900">
      <div className="text-center">
        <br />
        <p className="text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our Recent Projects</p>
        <br />
        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400 mx-8">The SCE Development Team is open to all students, no prior experience is required!</p>
        <br />
      </div>
      {projects.map((project) => (
        <>
          <ProjectCard key={project.name} {...project} />
          <br />
          <br />
        </>
      ))}
    </div>
  );
}
