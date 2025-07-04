import React from 'react'
import { useEffect, useState } from 'react'

  
export default function CardReaderAdminPage () {
  const [eventData, setEventData] = useState([])
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/api/OfficeAccessCard/listen');
        
    eventSource.onmessage = function(event) {
        //const newElement = document.createElement("li");
        //newElement.textContent = event.data;
        console.log(event.data);
        const date = new Date().toISOString();
        const entry = date + " " + event.data;
        setEventData(prev => [...prev, entry])
        //document.getElementById("events").appendChild(newElement);
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
            <pre>{event}</pre>
        ))}
    </div>
  )
}


