import { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../Enums';

export default function CardReader(props) {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const token = props.user.token;

  const buildLog = (data) => {
    let endpoint = data.endpoint;
    if (!endpoint.includes('?add=1')) {
      endpoint += '      ';
    }
    return [new Date().toISOString(), endpoint, data.statusCode, data.message].join('        ');
  };

  useEffect(() => {
    const url = new URL('/api/OfficeAccessCard/listen', BASE_API_URL);
    url.searchParams.append('token', token);
    const eventSource = new EventSource(url.href);
    eventSource.onmessage = (event) => {
      let data = JSON.parse(event.data);
      let newLog = buildLog(data);
      setLogs(currLogs => [newLog, ...currLogs]); // prepend the new log
    };

    eventSource.onerror = () => {
      setError('Error connecting to SSE');
    }

    return () => {
      eventSource.close();
    };

  }, []);

  return (
    <div className='m-4'>
      <h1 className='text-4xl font-bold text-white mb-4'>SCE Card Reader Activity</h1>
      <pre>
        {logs.join('\n')}
      </pre>
      {error && 
        <h2>{error}</h2>
      }
    </div>
  );
}
