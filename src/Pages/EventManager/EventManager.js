import React, { useState, useEffect } from 'react';
import {
  createNewEvent,
  editEvent,
  getAllEvents,
  deleteEvent
} from '../../APIFunctions/Event';
import { addEventToCalendar } from '../../APIFunctions/Mailer';
import './event-manager.css';
import { Button, Container } from 'reactstrap';
import EventManagerModal from './EventManagerModal';
import { eventModalState } from '../../Enums';
import EventCard from '../Events/EventCard';
import Header from '../../Components/Header/Header';
import * as countTime from '../../userTimeTraffic.js';

export default function EventManager(props) {
  const [modal, setModal] = useState(false);
  const [event, setEvent] = useState();
  const [modalState, setModalState] = useState(eventModalState.SUBMIT);
  const [eventList, setEventList] = useState([]);
  const headerProps = {
    title: 'Event Manager'
  };

  async function populateEventList() {
    const eventData = await getAllEvents();
    if (!eventData.error) setEventList(eventData.responseData);
  }

  useEffect(() => {
    populateEventList();
    window.addEventListener('onload', countTime.onLoad);
    document.addEventListener('visibilitychange', countTime.visibilityChange);
    return () => {
      window.removeEventListener('onload', countTime.onLoad);
      document.removeEventListener('visibilitychange',
        countTime.visibilityChange);
    };
  }, []);

  function toggle() {
    setModal(!modal);
  }

  function toggleEditEvent(event) {
    setModalState(eventModalState.EDIT);
    setEvent(event);
    toggle();
  }

  function toggleNewEvent() {
    setEvent();
    setModalState(eventModalState.SUBMIT);
    setModal(!modal);
  }

  async function handleSubmit(event) {
    if (modalState === eventModalState.SUBMIT) {
      const res = await createNewEvent(event, props.user.token);
      if (res.error === false) {
        const addEventRes = await addEventToCalendar(event, props.user.token);
        if (addEventRes.error === true) {
          alert('Cannot add event to Google Calendar due to Event conflict!');
        }
      } else {
        alert('Cannot create event!');
      }
    } else if (modalState === eventModalState.EDIT) {
      await editEvent(event, props.user.token);
    }
  }

  return (
    <React.Fragment>
      <Header {...headerProps} />
      <Container className='event-list'>
        <Button className='create-event' onClick={toggleNewEvent}>
          New Event
        </Button>
        {modal && (
          <EventManagerModal
            modal={modal}
            toggle={toggle}
            handleDelete={event => {
              deleteEvent(event, props.user.token);
              window.location.reload();
            }}
            handleSubmit={handleSubmit}
            modalState={modalState}
            populateEventList={populateEventList}
            token={props.user.token}
            {...event}
          />
        )}
        {eventList.length ? (
          <h4>Click on an event below to edit or delete it</h4>
        ) : null}
        {eventList.length ? (
          eventList.reverse().map((event, index) => {
            return (
              <React.Fragment key={index}>
                <EventCard
                  isEventManager = {true}
                  handleClick={() => toggleEditEvent(event)}
                  {...event}
                />
              </React.Fragment>
            );
          })
        ) : (
          <h1 className='empty-title'>No events yet!</h1>
        )}
      </Container>
    </React.Fragment>
  );
}
