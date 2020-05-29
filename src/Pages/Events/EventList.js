import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import './event-page.css';
import { getAllEvents } from '../../APIFunctions/Event';
import EventCard from './EventCard';
import EventInfoModal from './EventInfoModal';
import Header from '../../Components/Header/Header';

function AnnouncementList() {
  const [modal, setModal] = useState(false);
  const [currentEvent, setEvent] = useState(null);
  const [eventList, setEventList] = useState();
  const modalProps = {
    currentEvent,
    modal,
    toggle
  };

  const headerProps = {
    title: 'SCE Event Page'
  };

  useEffect(() => {
    async function fetchData() {
      await populateEventList();
    }
    fetchData();
  }, []);

  async function populateEventList() {
    const eventResponse = await getAllEvents();
    if (!eventResponse.error) setEventList(eventResponse.responseData);
  }

  function handleClick(clickedEvent) {
    setEvent(clickedEvent);
    toggle();
  }

  async function toggle() {
    setModal(!modal);
  }

  return (
    <div className='event-background'>
      <Header {...headerProps} />
      <Container className='event-list'>
        {currentEvent === null ? <></> : <EventInfoModal {...modalProps} />}
        {eventList && eventList.length ? (
          eventList.map((event, index) => {
            return (
              <EventCard
                key={index}
                handleClick={() => handleClick(event)}
                {...event}
              />
            );
          })
        ) : (
          <h1>No events yet!</h1>
        )}
      </Container>
    </div>
  );
}

export default AnnouncementList;
