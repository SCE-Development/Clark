import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import marked from 'marked';
import './lessons-page.css';
import { membershipState } from '../../Enums';
import LessonModal from './LessonModal';
import SummaryModal from './SummaryModal';
import { modalStates } from '../../Enums';
import {
  editLessons,
  getAllLessons,
  getSummary,
  editSummary,
} from '../../APIFunctions/Courses';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

function LessonsPage(props) {
  const history = useHistory();

  // Redirect to courses page if _id isn't passed as a prop
  if (!props.location.state) {
    history.push('/courses');
    location.reload();
  }

  const [mdContent, setMdContent] = useState();
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [modalState, setModalState] = useState(modalStates.SUBMIT);
  const [selectedLesson, setSelectedLesson] = useState({});
  const [summary, setSummary] = useState('');
  const [lessons, setLessons] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('Select a lesson');
  const lessonRefs = useRef({});
  const leftCol = useRef();
  const [isLessonEditBtnDisabled, setIsLessonEditBtnDisabled] = useState(true);
  const { _id } = props.location.state;
  const { courseTitle } = props.match.params;

  async function getLessons() {
    const data = await getAllLessons(_id);
    setLessons(data.responseData);
  }

  async function fetchSummary() {
    const data = await getSummary(_id);
    setSummary(data.responseData);
  }

  useEffect(() => {
    getLessons();
    fetchSummary();
  }, []);

  // Scroll to top of page when a new md file is rendered
  useEffect(() => {
    leftCol.current.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [mdContent]);

  async function getMDContent(URL) {
    axios
      .get(URL)
      .then((resp) => setMdContent(resp.data))
      .catch((err) => setMdContent('error'));
  }

  function handleClick(URL, title, index) {
    history.replace(`/course/${courseTitle}/lessons/${title}`, { _id: _id });
    if (Object.keys(selectedLesson).length > 0 && selectedLesson.html) {
      selectedLesson.html.style = null;
    }

    const selectedLessonRef = lessonRefs.current[index];
    setSelectedLesson({
      title,
      URL,
      index,
      html: selectedLessonRef,
    });

    selectedLessonRef.style.backgroundColor = '#999999';
    getMDContent(URL);
    setDropdownValue(title);
    setIsLessonEditBtnDisabled(false);
  }

  function LessonsToggle() {
    setShowLessonModal(!showLessonModal);
  }

  function SummaryToggle() {
    setShowSummaryModal(!showSummaryModal);
  }

  function handleAdd() {
    setModalState(modalStates.SUBMIT);
    setShowLessonModal(!showLessonModal);
  }

  function handleLessonEdit() {
    setModalState(modalStates.EDIT);
    setShowLessonModal(!showLessonModal);
  }

  async function handleLessonSubmit(newLesson) {
    let newLessons = [...lessons];

    if (modalState === modalStates.SUBMIT) newLessons.push(newLesson);
    else {
      setSelectedLesson({
        ...selectedLesson,
        title: newLesson.title,
        URL: newLesson.mdLink,
        index: lessons.length
      });
      newLessons[selectedLesson.index] = newLesson;
    }

    const response = await editLessons(_id, newLessons);

    if (response.error) alert('Lesson can\'t be added!');
    if (modalState === modalStates.EDIT) {
      getMDContent(newLesson.mdLink);
      leftCol.current.dangerouslySetInnerHTML = marked.parse(mdContent);
    }
  }

  async function handleSummaryEdit(newSummary) {
    await editSummary(_id, newSummary.trim());
    SummaryToggle();
    await fetchSummary();
  }

  function handleSummaryClick() {
    setMdContent('');
    if (Object.keys(selectedLesson).length > 0 && selectedLesson.html) {
      selectedLesson.html.style = null;
      setSelectedLesson({});
    }
    history.replace(`/course/${courseTitle}/lessons/summary`, { _id: _id });
    setIsLessonEditBtnDisabled(true);
  }

  async function handleLessonDelete() {
    let newLessons = [...lessons];
    newLessons.splice(selectedLesson.index, 1);
    await editLessons(_id, newLessons);
    selectedLesson.html.style = null;
    setSelectedLesson({});
    setMdContent(undefined);
  }

  return (
    <div className='lessons-container'>
      <div className='breadcrumb mb-0 pb-1 pt-1'>
        <h1 className='course-title'>{courseTitle}</h1>
      </div>
      <div
        className={`md-content-container col-sm-9 col-12
          pr-4 pl-4 pt-3 float-sm-left`}
        ref={leftCol}
      >
        {mdContent ? (
          mdContent === 'error' ? (
            <h2>Sorry, the link to this lesson seems to be invalid</h2>
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: marked.parse(mdContent) }}
              className='md-content'
            ></div>
          )
        ) : (summary && summary.length > 0 ? (
          <h2>{summary}</h2>
        ) : (
          <h2>No summary set yet</h2>
        ))}
      </div>
      <div className='lessons-list col-sm-3 col-12 pt-3'>
        {props.user &&
          (props.user.accessLevel === membershipState.ADMIN ||
            props.user.accessLevel === membershipState.OFFICER) && (
          <div
            className={`admin-btn-container pt-0 d-flex
              flex-column align-items-stretch flex-wrap
              flex-xl-row justify-content-between`}
          >
            <button
              className='SCEButton px-3 py-2'
              onClick={handleAdd}>
                Add a lesson
            </button>
            <button
              id='SCEBtn-2'
              className='SCEButton px-2 py-2'
              onClick={handleLessonEdit}
              disabled={isLessonEditBtnDisabled}
            >
                Edit selected lesson
            </button>
            <button
              id='SCEBtn-3'
              className='SCEButton px-2 py-2'
              onClick={SummaryToggle}
            >
                Edit course home
            </button>
          </div>
        )}
        <button
          id='SCEBtn-4'
          className='SCEButton btn-block px-2 py-2 mb-3 mt-3'
          onClick={handleSummaryClick}
        >
            Course home
        </button>
        <h2 className='lessons-title'>Lessons</h2>
        {lessons.length > 0 && (
          <div className='d-none d-sm-block'>
            {lessons.map((article, index) => (
              <div
                className='lesson-name-container'
                onClick={(e) =>
                  handleClick(article.mdLink, article.title, index)
                }
                key={index}
              >
                <h5
                  className='lesson-name pl-2 mb-0'
                  ref={element => lessonRefs.current[index] = element}
                >
                  {index + 1}. {article.title}
                </h5>
              </div>
            ))}
          </div>
        )}
        <div className={`lesson-dropdown d-block d-sm-none
          d-flex justify-content-center mt-3 mb-4`}>
          <Dropdown
            isOpen={dropdownOpen}
            toggle={() => setDropdownOpen(!dropdownOpen)}
          >
            <DropdownToggle caret>{dropdownValue}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>
                <p className='text-muted h5 mb-0'>Lessons</p>
              </DropdownItem>
              <DropdownItem divider />
              {lessons.length > 0 && (
                <React.Fragment>
                  {lessons.map((article, index) => (
                    <DropdownItem key={index}>
                      <div
                        onClick={(e) =>
                          handleClick(article.mdLink, article.title, index)
                        }
                      >
                        {article.title}
                      </div>
                    </DropdownItem>
                  ))}
                </React.Fragment>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {showLessonModal && (
        <LessonModal
          showLessonModal={showLessonModal}
          LessonsToggle={LessonsToggle}
          handleLessonDelete={handleLessonDelete}
          handleLessonSubmit={handleLessonSubmit}
          modalState={modalState}
          token={props.user.token}
          selectedLesson={selectedLesson}
          getLessons={getLessons}
        />
      )}
      {showSummaryModal && (
        <SummaryModal
          handleSummaryEdit={handleSummaryEdit}
          SummaryToggle={SummaryToggle}
          showSummaryModal={showSummaryModal}
          summary={summary}
        />
      )}
    </div>
  );
}

export default LessonsPage;
