import React, { useState, useEffect } from 'react';
import {
  createNewEvent,
  editEvent,
  getAllEvents,
  deleteEvent
} from '../../APIFunctions/Event';
import './event-manager.css';
import { Button, Container } from 'reactstrap';
import EventManagerModal from './EventManagerModal';
import { eventModalState } from '../../Enums';
import EventCard from '../Events/EventCard';

export default function EventManager(props) {
  const [modal, setModal] = useState(false);
  const [event, setEvent] = useState();
  const [modalState, setModalState] = useState(eventModalState.SUBMIT);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    populateEventList();
  }, []);

  async function populateEventList() {
    const eventData = await getAllEvents();
    if (!eventData.error) setEventList(eventData.responseData);
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

  function toggle() {
    setModal(!modal);
  }

  async function handleSubmit(event) {
    if (modalState === eventModalState.SUBMIT) {
      await createNewEvent(event, props.user.token);
    } else if (modalState === eventModalState.EDIT) {
      await editEvent(event, props.user.token);
    }
  }

  return (
    <div className='event-background'>
      <h1>Event Manager</h1>
      <Container>
        <Button className='create-event' onClick={toggleNewEvent}>
          New Event
        </Button>
        {modal && (
          <EventManagerModal
            modal={modal}
            toggle={toggle}
            handleDelete={event => deleteEvent(event, props.user.token)}
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
          eventList.map((event, index) => {
            return (
              <React.Fragment key={index}>
                <EventCard
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
    </div>
  );
}
