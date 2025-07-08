import React from 'react'
import { useEffect, useState } from 'react'

  
export default function CardReaderAdminPage () {
  const [eventData, setEventData] = useState([])
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/api/OfficeAccessCard/listen');
        
    eventSource.onmessage = function(event) {
        console.log(JSON.parse(event.data));
        setEventData(prev => [...prev, event.data])
    };

    eventSource.onerror = function(event) {
        console.log('Error occurred:', event);
    };

    return () => eventSource.close();
  }, []);
  
  return (
    <div>
        <h1>Welcome to the Card Reader Admin Page</h1>
        {eventData.map((event) => (
            <pre>{JSON.parse(event).ISO_date} {JSON.parse(event).endpoint} {JSON.parse(event).response_code} {JSON.parse(event).response_string} {JSON.parse(event).cardBytes}</pre>
        ))}
    </div>
  )
}


