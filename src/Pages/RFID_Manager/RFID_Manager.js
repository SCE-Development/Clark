import React, { useState, useEffect } from 'react';
import {
  createNewRFID,
  getAllRFIDs,
  deleteRFID,
  readNewRFID,
} from '../../APIFunctions/RFID';

import './rfid-manager.css';
import { Button, Container } from 'reactstrap';
import EventManagerModal from './RFID_ManagerModal';
import { eventModalState } from '../../Enums';
import EventCard from '../Events/EventCard';
import Header from '../../Components/Header/Header';

export default function EventManager(props) {
  const [modal, setModal] = useState(false);
  const [event, setEvent] = useState();
  const [modalState, setModalState] = useState(eventModalState.SUBMIT);
  const [eventList, setEventList] = useState([]);
  const headerProps = {
    title: 'RFID Manager',
  };

  async function populateEventList() {
    const eventData = await getAllRFIDs();
    if (!eventData.error) setEventList(eventData.responseData);
  }

  useEffect(() => {
    populateEventList();
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
      const createRFID = await createNewRFID(event, props.user.token);
      const receiveRFIDByte = await readNewRFID(event, props.user.token);
      if (createRFID.error === false) {
        if (receiveRFIDByte.responseData.check) {
          // show check mark
        } else {
          // red cross
        }
      }
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
            handleDelete={(event) => {
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
                  isEventManager={true}
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
