import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import marked from 'marked';
import './lessons-page.css';
import { membershipState } from '../../Enums';
import { Button } from 'reactstrap';
import LessonsPageModal from './LessonsPageModal';
import { modalStates } from '../../Enums';
import { editLessons, getAllLessons } from '../../APIFunctions/Courses';

function LessonsPage(props) {
  const [mdContent, setMdContent] = useState();
  const [showModal, setShowModal] = useState();
  const [modalState, setModalState] = useState(modalStates.SUBMIT);
  const [selectedLesson, setSelectedLesson] = useState({});
  const [lessons, setLessons] = useState([]);
  const leftCol = useRef();
  const { _id } = props.location.state;

  async function getLessons() {
    const data = await getAllLessons(_id);
    setLessons(data.responseData);
  }

  useEffect(() => {
    getLessons();
  }, []);

  // Scroll to top of page when a new md file is rendered
  useEffect(() => {
    leftCol.current.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [mdContent]);

  async function getMDContent(URL) {
    axios.get(URL)
      .then(resp => setMdContent(resp.data))
      .catch(err => setMdContent('error'));
  }

  function handleClick(URL, title, index, e) {
    if(Object.keys(selectedLesson).length > 0)
      selectedLesson.html.style = null;

    setSelectedLesson({
      title,
      URL,
      index,
      html:e.target
    });

    e.target.style.backgroundColor = '#DCDCDC';
    getMDContent(URL);
  }

  function toggle() {
    setShowModal(!showModal);
  }

  function handleAdd() {
    setModalState(modalStates.SUBMIT);
    setShowModal(!showModal);
  }

  function handleEdit() {
    setModalState(modalStates.EDIT);
    setShowModal(!showModal);
  }

  async function handleSubmit(newLesson) {
    let newLessons = [...lessons];

    if (modalState === modalStates.SUBMIT)
      newLessons.push(newLesson);
    else {
      setSelectedLesson({
        ...selectedLesson,
        title:newLesson.title,
        URL:newLesson.mdLink
      });
      newLessons[selectedLesson.index] = newLesson;
    }

    const response = await editLessons(_id, newLessons);

    if (response.error)
      alert('Lesson can\'t be added!');
    if (modalState === modalStates.EDIT) {
      getMDContent(newLesson.mdLink);
      leftCol.current.dangerouslySetInnerHTML =
        marked.parse(mdContent);
    }
  }

  async function handleDelete() {
    let newLessons = [...lessons];
    newLessons.splice(selectedLesson.index, 1);
    await editLessons(_id, newLessons);
    selectedLesson.html.style = null;
    setSelectedLesson({});
    setMdContent(undefined);
  }

  return (
    <div className='lessons-container'>
      <div
        className='left-col col-9 pr-3 pt-3 float-left'
        ref={leftCol}
      >
        {mdContent ?
          mdContent === 'error' ?
            <h2>Sorry, the link to this lesson seems to be invalid</h2> :
            <div
              dangerouslySetInnerHTML={{__html:marked.parse(mdContent)}}
              className='md-content'>
            </div>
          :
          lessons.length > 0 ? <h2>Click a lesson and learn more!</h2> :
            <h2>There are no lessons for this course yet</h2>}
      </div>
      <div className='lessons-list col-3 pt-3'>
        {props.user &&
              (props.user.accessLevel === membershipState.ADMIN ||
                props.user.accessLevel === membershipState.OFFICER) &&
                <div className='container pt-2 pb-2'>
                  <Button
                    className='mr-2'
                    color='success'
                    onClick={handleAdd}>
                    Add a lesson
                  </Button>
                  <Button
                    color='warning mr-2'
                    onClick={handleEdit}
                    disabled={Object.keys(selectedLesson).length === 0}>
                    Edit selected lesson
                  </Button>
                </div>}
        {lessons.length > 0 &&
          <div>
            <h2 className='lessons-title'>Lessons</h2>
            {lessons.map((article, index) => (
              <div
                className='lesson-block'
                onClick={(e) =>
                  handleClick(article.mdLink, article.title, index, e)}
                key={index}>
                <h5 className='lesson-name pl-2 mb-0'>
                  {index + 1}. {article.title}
                </h5>
              </div>))}
          </div>}
      </div>
      {showModal &&
        <LessonsPageModal
          showModal={showModal}
          toggle={toggle}
          handleDelete={handleDelete}
          handleSubmit={handleSubmit}
          modalState={modalState}
          token={props.user.token}
          selectedLesson={selectedLesson}
          getLessons={getLessons}
        />
      }
    </div>
  );
}

export default LessonsPage;
