import React, { useState, useEffect } from 'react';
import { sendMessage, connectToRoom } from '../../APIFunctions/Messaging';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function Messaging(props) {
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-gray-200 mb-4">SCE Chatroom</h1>
      <MessagingForm />
      <h1 className="text-3xl font-bold text-gray-200 mt-8">Feed</h1>
      <Feed token={props.user.token} id={id} />
    </div>
  );
}

function MessagingForm() {
  const [id, setId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (id) {
      history.push(`/messaging/${id}`);
    } else {
      history.push('/messaging/general');
    }

    const status = await sendMessage(id, apiKey, message);

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
      className="w-1/2 mx-auto p-6 bg-zinc-900 rounded-md shadow-lg"
    >
      <div className="mb-4">
        <label htmlFor="room" className="block text-sm font-medium text-gray-400">
          Room
        </label>
        <input
          autoComplete="off"
          id="room"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter room name"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="key" className="block text-sm font-medium text-gray-400">
          Key
        </label>
        <input
          autoComplete="off"
          id="key"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your key"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-400">
          Message
        </label>
        <textarea
          id="message"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your message"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>

      {sent && (
        errorMessage ? (
          <div className="mt-4 p-2 min-h-12 flex items-center justify-center bg-red-100 text-red-700 rounded-md shadow-md">
            {errorMessage}
          </div>
        ) : (
          <div className="mt-4 p-2 min-h-12 flex items-center justify-center bg-green-100 text-green-700 rounded-md shadow-md">
            Message sent to room {`'${id || 'general'}'`}
          </div>
        )
      )}
    </form>
  );
}

function Feed(props) {
  const { token, id } = props;
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  let eventSource;

  useEffect(() => {
    const roomId = id || 'general';

    if (!token) return;

    const handleNewMessage = (data) => {
      setMessages(prevMessages => [...prevMessages, `${data}`]);
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
      <div className="border border-gray-300 p-3 h-52 overflow-y-auto bg-gray-100 w-1/2 rounded-lg mt-3">
        {messages.map((message, index) => (
          <div key={index} className="p-2 mb-1 border-b border-gray-200 text-gray-700">{message}</div>
        ))}
      </div>
    </div>
  );
}

