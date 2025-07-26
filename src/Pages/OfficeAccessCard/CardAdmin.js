import { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../Enums';
import { useUser } from '../../Components/context/UserContext';
// import { EventListening } from './EventListening.js';

export default function CardAdminPage() {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const token = user.token;

  function EventListening() {
    return (
      <pre>
        {messages.join('\n')}
      </pre>
    );
  }

  useEffect(() => {

    const url = new URL('/api/OfficeAccessCard/listen', BASE_API_URL);
    url.searchParams.append('token', token);

    const eventSource = new EventSource(url.href);

    console.log("connected to eventsource");

    eventSource.onmessage = (event) => {
      console.log(event);
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        const eventMessage = [
          `${data.requestTime}`.padEnd(29),
          `${data.endpoint.slice(21)}`.padEnd(38),
          `${data.requestType}`.padEnd(8),
          `${data.responseCode}`.padEnd(7),
          `${data.logResponse}`.padEnd(15)
        ].join('');
        console.log(eventMessage);
        setMessages(prev => [eventMessage, ...prev]);
      } catch (e) {
        console.log(e);
        setMessages(prev => [e, ...prev]);
      }
    };

    eventSource.onerror = (error) => {
      console.log("Error with eventsource: ", error)
    }

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        Welcome to the Card Reader Page!
      </h1>
      <h2 className='text-center'>Recent Events</h2>
      <EventListening/>
    </div>
  );
}
