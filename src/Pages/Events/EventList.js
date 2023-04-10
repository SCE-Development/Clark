import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import './event-page.css';
import { getDiscordMessages } from '../../APIFunctions/Discord'
import EventCard from './EventCard';
import Header from '../../Components/Header/Header';

function AnnouncementList() {

  const ANNOUNCEMENT_CHANNEL_ID = "1088216227278753802"
  const MESSAGE_LIMIT = "100"
  const EVENT_MENTION = "1094797976406331432";

  const [eventList, setEventList] = useState();

  const headerProps = {
    title: 'SCE Event Page'
  };

  function parseEventsFromMessages(messages) {
      let events = []
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].mention_roles.length != 0 && messages[i].mention_roles[0] === EVENT_MENTION && messages[i].attachments.length != 0) {
          const eventData = messages[i].content.split(", ");
            events.push({
                title          : eventData[1],      
                description    : eventData[2],
                eventDate      : eventData[3],
                eventLocation  : eventData[4],
                startTime      : eventData[5],
                endTime        : eventData[6],
                isEventManager : false,
                handleClick    : NaN,
                imageURL       : messages[i].attachments[0].proxy_url
            })
        }
      }
      return events
  }

  async function populateEventList() {
    let response = await getDiscordMessages(ANNOUNCEMENT_CHANNEL_ID, MESSAGE_LIMIT)
    if (!response.error) {
      const events = parseEventsFromMessages(response.responseData)
      setEventList(events)
    }
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
