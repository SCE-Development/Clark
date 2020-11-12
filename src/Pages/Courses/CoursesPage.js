import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import './courses-page.css';
import CourseCard from './CourseCard';
import Header from '../../Components/Header/Header';
import { getAllCourses } from '../../APIFunctions/Courses';
import LessonsPage from '../Lessons/LessonsPage';

// Group together every 3 course cards
export function groupCards(courses) {
  let groups = [];
  let temp = [];

  courses.map((course, index) => {
    if (index%3 === 0 && index !== 0) {
      groups.push(temp);
      temp = [];
    }

    temp.push(course);
  });

  if (temp.length !== 0) {
    groups.push(temp);
  }

  return groups;
}

export default function CoursesList() {
  const [coursesList, setCoursesList] = useState({});
  let cardNum = 0;

  async function getCourses() {
    const data = await getAllCourses();
    setCoursesList(data.responseData);
  }

  useEffect(() => {
    getCourses();
  }, []);

  const headerProp = {
    title: 'SCE Courses Page'
  };

  function handleClick(clickedCourse) {
    return (
      <BrowserRouter>
        <LessonsPage lessons={clickedCourse.lessons}/>
      </BrowserRouter>
    );
  }

  return (
    <div className='courses-background'>
      <Header {...headerProp} />
      <Container className='course-cards mb-5 mt-5'>
        {coursesList.length > 0 ? (
          groupCards(coursesList).map((group, index) => {
            return (
              <Row key={index}>
                {group.map((course, index) => {
                  {++cardNum;}
                  return (
                    <Col xs='12' md='4'key={index}>
                      <CourseCard
                        cardNum={cardNum}
                        handleClick={() => handleClick(course)}
                        {...course}
                      />
                    </Col>
                  );
                })}
              </Row>
            );
          })
        ) : (
          <h1>No courses published yet!</h1>
        )}
      </Container>
    </div>
  );
}
