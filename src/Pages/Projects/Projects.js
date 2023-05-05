import React from 'react';
import './Projects.css';
import ProjectHeader from './Components/ProjectsHeader';
import ProjectCard from './Components/ProjectCard';
import ProjectsFooter from './Components/ProjectsFooter';

export default function ProjectsPage() {
  const projectData = [
    {'link': 'https://github.com/SCE-Development/Clark',
      'image': 'https://user-images.githubusercontent.com' +
      '/59713070/235862105-9606e862-e27e-40d4-8991-de1793c48dd0.png',
      'name':'Clark', 'subnote':'',
      'caption':'Made entirely by SJSU students, Clark is' +
      ' the Software and Computer Engineering Society\'s outward face on the internet.'
    },
    {'link': 'https://github.com/SCE-Development/Clark',
      'image': 'https://user-images.githubusercontent.com' +
      '/59713070/235862570-70f92c0a-8e18-4ddf-b7c8-bdb21723480f.jpeg',
      'name':'RFID Door System', 'subnote':'',
      'caption':'To expedite officer entry, SCE\'s development team' +
      ' officers created an RFID system, alongside databases to' +
      ' handle unique student entry into the clubroom\'s office.'
    },
    {'link': 'https://github.com/SCE-Development/Clark',
      'image': 'https://user-images.githubusercontent.com' +
      '/59713070/235861717-5315d9df-fb5e-4414-84bb-0334fe769271.jpeg',
      'name':'3D Pancake Printer', 'subnote':'',
      'caption':'In the spirit of our love for pancakes, SCE\'s' +
      ' hardware team constructed a 3D Pancake Printer, which creates' +
      ' intricate pancake designs for all members to enjoy.'
    },
    {'link': 'https://github.com/SCE-Development/Clark',
      'image': 'https://user-images.githubusercontent.com' +
      '/59713070/235859723-cdea1a8e-5698-40c2-9755-9ec2e40984cd.jpeg',
      'name':'SCE Light-Emitting Display', 'subnote':'',
      'caption':'Produced as a part of our summer internship projects, ' +
      ' SCE\'s clubroom features a student-controlled illuminated sign ' +
      'to brighten the club\'s atmosphere.'
    },

  ];

  return (
    <>
      <div className='projects-bg'>
        <ProjectHeader />
        <div className='projects-table'>
          {projectData.map((project, index) => {
            if (index % 2 === 0) { // skip odd indices b/c cards are in twos
              const nextProject = projectData[index + 1];
              return (
                <div className="project-row" key={index}>
                  <ProjectCard {...project} />
                  <div className="divider" />
                  <ProjectCard {...nextProject} />
                </div>
              );
            }
          })}
        </div>
        <ProjectsFooter />
      </div>
    </>
  );
}
