import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import './event-page.css';
import { getUpcomingEvents } from '../../APIFunctions/Event';
import EventCard from './EventCard';
import Header from '../../Components/Header/Header';

function AnnouncementList() {
  const [eventList, setEventList] = useState();

  const headerProps = {
    title: 'SCE Event Page'
  };

  async function populateEventList() {
    const eventResponse = await getUpcomingEvents();
    if (!eventResponse.error) setEventList(eventResponse.responseData);
  }

  useEffect(() => {
    async function fetchData() {
      await populateEventList();
    }
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Header {...headerProps} />
      <Container className='event-list'>
        {eventList && eventList.length ? (
          eventList.reverse().map((event, index) => {
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
