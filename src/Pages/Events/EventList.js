import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import './event-page.css';
import { getAllEvents } from '../../APIFunctions/Event';
import EventCard from './EventCard';
import EventInfoModal from './EventInfoModal';
import Header from '../../Components/Header/Header';

function AnnouncementList() {
  const [modal, setModal] = useState(false);
  const [getFiltered, setGetFiltered] = useState(true);
  const [currentEvent, setEvent] = useState(null);
  const [eventList, setEventList] = useState();
  const [validList, setValidList] = useState();

  async function toggle() {
    setModal(!modal);
  }

  const modalProps = {
    currentEvent,
    modal,
    toggle
  };

  const headerProps = {
    title: 'SCE Event Page'
  };

  async function populateEventList() {
    const eventResponse = await getAllEvents();
    if (!eventResponse.error) setEventList(eventResponse.responseData);
  }

  const getFilteredEvents= () => {
    if (getFiltered){
      try {
        var currDate = new Date();
        currDate.setDate(currDate.getDate() -1);
        let validList = [];
        eventList.forEach(item => {
          let date = new Date(item.eventDate);
          if (date >= currDate) {
            validList.push(item);
          }
        }, setValidList(validList), setGetFiltered(false));
      } catch (error) {
        const alertText = 'There are no events to filter!';
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      await populateEventList();
    }
    fetchData();
  }, []);

  function handleClick(clickedEvent) {
    setEvent(clickedEvent);
    toggle();
  }

  return (
    <div className='event-background'>
      <Header {...headerProps} />
      <Container className='event-list'>
        {currentEvent === null ? <></> : <EventInfoModal {...modalProps} />}
        {console.log(eventList)}
        {getFilteredEvents()}
        {validList && validList.length ? (
          validList.reverse().map((event, index) => {
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
