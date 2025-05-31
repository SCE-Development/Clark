import { useState, useEffect } from "react";

export default function CardReader() {

  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/OfficeAccessCard/listen");
    eventSource.onmessage = (event) => {
      const newLog = new Date().toISOString() + " " + event.data;
      setLogs(currLogs => [newLog, ...currLogs]); // prepend the new log
    };
    
    eventSource.onerror = (event) => {
      console.log("Error: ", event);
    };

    return () => {
      eventSource.close();
    };

  }, []);

  return (
    <div>
      <h1>Welcome to the card reader page!</h1>
      <pre>
        {logs.join("\n")}
      </pre>
    </div>
  );
}