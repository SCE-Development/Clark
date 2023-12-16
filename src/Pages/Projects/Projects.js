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
      'name':'Clark', 'subnote':'(formerly Core-v4)',
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
      ' SCE interns designed an officer-controlled illuminated sign, ' +
      'functioning to brighten the clubroom\'s atmosphere.'
    },
    {'link': 'https://github.com/SCE-Development/sce-speaker',
      'image': 'https://user-images.githubusercontent.com/55469119' +
      '/290972846-734e90ab-73f8-4460-a24a-2fdb601874ce.jpg',
      'name': 'Sce Speaker', 'subnote':'',
      'caption': 'In the spirit of our love for speakers, SCE\'s dev team ' +
      'constructed a speaker api, which streams youtube audio which is ' +
      'requested  by a user on clark through an ssh tunnel!'
    },
  ];

  return (
    <>
      <div className='projects-bg'>
        <ProjectHeader />
        <div className='projects-table'>
          {projectData.map((project, index) => {
            if (index % 2 === 0 && projectData[index + 1] == null) {
              return (
                <div className="project-container" id="alt" key={index}>
                  <div className="divider"></div>
                  <ProjectCard {...project} />
                  <div className="divider"></div>
                </div>
              );
            } else {
              return (
                <div className="project-container" key={index}>
                  <ProjectCard {...project} />
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
