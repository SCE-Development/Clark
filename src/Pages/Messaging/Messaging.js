import React, { useState, useEffect } from 'react';
import { sendMessage, connectToRoom } from '../../APIFunctions/Messaging';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { use } from 'chai';

export default function Messaging(props) {
  const { id } = useParams();
  const history = useHistory();
  const [roomIdInput, setRoomIdInput] = useState(id || '');
  const [roomIdSubmit, setRoomIdSubmit] = useState(id || 'general');

  const handleSubmit = (event) => {
    event.preventDefault();
    setRoomIdSubmit(roomIdInput);
  };

  useEffect(() => {
    if (roomIdSubmit) {
      history.push(`/messaging/${roomIdSubmit || 'general'}`);
    }
  }, [roomIdSubmit]);


  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-gray-200 mt-8">{id ? `room: ${id}` : 'no room connected'} </h1>
      <form onSubmit={handleSubmit}
        className="flex flex-row gap-x-2 justify-center items-center mt-1">
        <input placeholder="Enter channel name" onChange={(e) => setRoomIdInput(e.target.value)} className="block w-2/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        <button
          type="submit"
          className="w-1/10 px-4 h-10 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            Connect
        </button>
      </form>
      <Feed token={props.user.token} id={roomIdSubmit || id} />
      <MessagingForm token={props.user.token} id={roomIdSubmit || id} />
    </div>
  );
}

function MessagingForm(props) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { token, id } = props;


  const handleSubmit = async (event) => {
    event.preventDefault();

    const status = await sendMessage(id, token, message);

    if (status.error) {
      setErrorMessage(status.responseData.response.data || 'An error occurred while sending the message.');
    } else {
      setErrorMessage('');
    }

    setSent(true);
    setMessage('');

    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-2/3 mx-auto p-4 bg-zinc-900 rounded-md shadow-lg"
    >
      <div className="flex flex-row items-center gap-x-2">
        <textarea
          id="message"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="block h-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your message"
        ></textarea>
        <button
          type="submit"
          className="w-1/10 px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>



      {
        sent && errorMessage && (
          <div className="mt-4 p-2 min-h-12 flex items-center justify-center bg-red-100 text-red-700 rounded-md shadow-md">
            {errorMessage}
          </div>
        )
      }
    </form>
  );
}

function Feed(props) {
  const { token, id } = props;
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const roomId = id || 'general';
    let eventSource;

    if (!token) return;

    setMessages([]);

    const handleNewMessage = (data) => {
      setMessages(prevMessages => [...prevMessages, `${data}`]);
      const element = document.getElementById('messages');
      element.scrollTop = element.scrollHeight;
    };

    const handleError = (event) => {
      setError('Error connecting to SSE');
    };

    const initEventSource = async () => {
      eventSource = await connectToRoom(roomId, token, handleNewMessage, handleError);
    };

    initEventSource();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [id, token]);


  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <div className="w-1/2 p-3 my-2 flex items-center justify-center text-red-700 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}
      <div id="messages" className="border border-gray-300 p-3 h-96 overflow-y-auto bg-gray-100 w-2/3 rounded-lg mt-3">
        {messages.map((message, index) => (
          <div key={index} className="p-2 mb-1 border-b border-gray-200 text-gray-700">{message}</div>
        ))}
      </div>
    </div>
  );
}

