import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import './event-page.css';
import { getAllEvents } from '../../APIFunctions/Event';
import EventCard from './EventCard';
import Header from '../../Components/Header/Header';
import * as countTime from '../../userTimeTraffic.js';

function AnnouncementList() {
  const [getFiltered, setGetFiltered] = useState(true);
  const [eventList, setEventList] = useState();
  const [validList, setValidList] = useState();

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
        let currDate = new Date();
        currDate.setDate(currDate.getDate() -1);
        let validList = [];
        eventList.forEach(item => {
          let date = new Date(item.eventDate);
          if (date >= currDate) {
            validList.push(item);
          }
        }, setValidList(validList), setGetFiltered(false));
      } catch (error) {
      }
    }
  };

  useEffect(() => {
    window.addEventListener('onload', countTime.onLoad);
    document.addEventListener('visibilitychange',
      countTime.visibilityChange);
    async function fetchData() {
      await populateEventList();
    }
    fetchData();
    return () => {
      window.removeEventListener('onload', countTime.onLoad);
      document.removeEventListener('visibilitychange',
        countTime.visibilityChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Header {...headerProps} />
      <Container className='event-list'>
        {getFilteredEvents()}
        {validList && validList.length ? (
          validList.reverse().map((event, index) => {
            return (
              <EventCard
                key={index}
                isEventManager = {false}
                {...event}
              />
            );
          })
        ) : (
          <h1 className = 'no-event-list'>No events yet!</h1>
        )}
      </Container>
    </React.Fragment>
  );
}

export default AnnouncementList;
