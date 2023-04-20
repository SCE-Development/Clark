import React from 'react';
import './Projects.css';
import ProjectHeader from './Components/ProjectsHeader';
import ProjectCard from './Components/ProjectCard';
import ProjectsFooter from './Components/ProjectsFooter';

export default function ProjectsPage() {
  return (
    <>
      <div className='projects-bg'>
        <ProjectHeader />
        <div className='projects-table'>
          <div className='project-row'>
            <ProjectCard
              link={'https://github.com/SCE-Development/Clark'}
              image={'https://user-images.githubusercontent.com' +
              '/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png'}
              name={'Clark'}
              subnote={'(formerly Core-v4)'}
              caption={'Made entirely by SJSU students, Clark is' +
              ' the Software and Computer Engineering Society\'s outward face on the internet.'} />
            <div className="divider"></div>
            <ProjectCard
              link={'https://github.com/SCE-Development/Clark'}
              image={'https://user-images.githubusercontent.com' +
              '/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png'}
              name={'RFID Office Door System'}
              subnote={''}
              caption={'To enhance ease of use, SCE\'s development team' +
              ' officers created an RFID system, alongside databases to' +
              'handle unique officer entry into the clubroom\'s office.'} />
          </div>
          <div className='project-row'>
            <ProjectCard
              link={'https://github.com/SCE-Development/Clark'}
              image={'https://user-images.githubusercontent.com' +
              '/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png'}
              name={'3D Pancake Printer'}
              subnote={''}
              caption={'In the spirit of our love for pancakes, SCE\'s' +
              ' hardware team constructed a 3D Pancake Printer, which creates' +
              ' intricate pancake designs for all members to enjoy.'} />
            <div className="divider"></div>
            <ProjectCard
              link={'https://github.com/SCE-Development/Clark'}
              image={'https://user-images.githubusercontent.com' +
              '/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png'}
              name={'SCE Light-Emitting Display'}
              subnote={''}
              caption={'Produced as a part of our summer internship projects, ' +
              ' SCE\'s clubroom features a student-controlled illuminated sign ' +
              'to brighten the club\'s atmosphere.'} />
          </div>
        </div>
        <ProjectsFooter />
      </div>
    </>
  );
}
