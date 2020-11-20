import React, { useState, useEffect } from 'react';
import { Button, Container } from 'reactstrap';
import CoursesManagerModal from './CoursesManagerModal';
import CourseCard from '../Courses/CourseCard';
import { groupCards } from '../Courses/CoursesPage';
import Header from '../../Components/Header/Header';
import { modalStates } from '../../Enums';
import {Row, Col} from 'reactstrap';
import {
  getAllCourses,
  createNewCourse,
  editCourse,
  deleteCourse
} from '../../APIFunctions/Courses';

function CoursesManager(props) {
  const [coursesList, setCoursesList] = useState([]);
  const [course, setCourse] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState(modalStates.SUBMIT);
  let cardNum = 0;

  const headerProp = {
    title: 'Courses Manager'
  };

  async function getCourses() {
    const data = await getAllCourses();
    setCoursesList(data.responseData);
  }

  useEffect(() => {
    getCourses();
  }, []);

  function toggle() {
    setShowModal(!showModal);
  }

  function createCourse() {
    setCourse();
    setModalState(modalStates.SUBMIT);
    setShowModal(!showModal);
  }

  async function handleSubmit(_id, course) {
    if (modalState === modalStates.SUBMIT) {
      const response = await createNewCourse(course, props.user.token);
      if (response.error)
        alert('Course can\'t be added!');
    } else if (modalState === modalStates.EDIT)
      await editCourse( { ...course, _id }, props.user.token);
  }

  function toggleEditCourse(course) {
    setModalState(modalStates.EDIT);
    setCourse(course);
    toggle();
  }

  return (
    <React.Fragment>
      <Header {...headerProp}/>
      <Container className="courses-cards mt-4">
        <Button className="create-course" onClick={createCourse}>
          Add a course
        </Button>
        {showModal &&
          <CoursesManagerModal
            showModal={showModal}
            toggle={toggle}
            handleDelete={course => {
              deleteCourse(course, props.user.token);
              window.location.reload();
            }}
            handleSubmit={handleSubmit}
            getCourses={getCourses}
            modalState={modalState}
            getAllCourses={getAllCourses}
            token={props.user.token}
            {...course}
          />
        }
        {coursesList.length > 0 ? (
          <h4 className='mt-2 mb-4'>Click a card to edit or delete it</h4>
        ) : null}
        {coursesList.length > 0 ? (
          groupCards(coursesList).map((group, index) => {
            return (
              <Row key={index}>
                {group.map((course, index) => {
                  {++cardNum;}
                  return (
                    <Col xs='12' md='4' key={index}>
                      <CourseCard
                        cardNum={cardNum}
                        handleClick={() => toggleEditCourse(course)}
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
    </React.Fragment>
  );
}

export default CoursesManager;
