import { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../Enums';
import { getCardsFromDb, deleteCardFromDb } from '../../APIFunctions/CardReader';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal';
import { trashcanSymbol } from '../Overview/SVG';

export default function CardReader(props) {
  const [logs, setLogs] = useState([]);
  const [cards, setCards] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [cardToDelete, setCardToDelete] = useState({});
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'registry';
  });
  const [connected, setConnected] = useState(true);

  const buildLog = (data) => {
    let date = new Date().toISOString().padEnd(30, ' ');
    let endpoint = data.endpoint.padEnd(20, ' ');
    let statusCode = String(data.statusCode).padEnd(15, ' ');
    return [date, endpoint, statusCode, data.message].join('');
  };

  const header = [
    'TIMESTAMP'.padEnd(30),
    'ENDPOINT'.padEnd(20),
    'STATUS CODE'.padEnd(15),
    'MESSAGE\n'
  ].join('');

  async function getAllCards() {
    const cardsFromDb = await getCardsFromDb(props.user.token);
    if (!cardsFromDb.error) {
      setCards(cardsFromDb.responseData);
    }
  }

  function handleTabChange(newTab) {
    setTab(newTab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', newTab);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }

  useEffect(() => {
    getAllCards();
    const url = new URL('/api/OfficeAccessCard/listen', BASE_API_URL);
    url.searchParams.append('token', props.user.token);
    const eventSource = new EventSource(url.href);
    eventSource.onmessage = (event) => {
      try {
        let data = JSON.parse(event.data);
        if (data.endpoint === '/verify?add=1') { // re-query if card was added while client open
          getAllCards();
        }
        let newLog = buildLog(data);
        setLogs(currLogs => [newLog, ...currLogs]); // prepend the new log
      } catch (err) {
        setLogs(
          (currLogs) => [
            '[error] unable to format response, check browser logs',
            ...currLogs,
          ]
        );
      }
    };

    eventSource.onerror = () => {
      setLogs(
        (currLogs) => [
          '...crickets...',
          ...currLogs
        ]
      );
      setConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  function getComponentFromTabChoice(tab) {
    if (tab === 'registry') {
      return (
        <div>
          <ConfirmationModal {... {
            headerText: `Delete card: ${cardToDelete.cardBytes}?`,
            bodyText: `Are you sure you want to delete 
              card: ${cardToDelete.cardBytes}? It'll be gone forever if you do.`,
            confirmText: `Yes, delete card: ${cardToDelete.cardBytes}`,
            cancelText: 'No, keep the card',
            confirmClassAddons: 'bg-red-600 hover:bg-red-500',
            handleConfirmation: async () => {
              await deleteCardFromDb(props.user.token, cardToDelete.cardBytes);
              await getAllCards();
              setToggleDelete(!toggleDelete);
            },
            open: toggleDelete
          }
          } />
          <div className='m-4 flex flex-col'>
            <table className='table px-3'>
              <thead className=''>
                <tr className=''>
                  {[
                    'Card Bytes',
                    'Registration Date',
                    'Last Verified At',
                    'Verified Count'
                  ].map(title => (
                    <th key={title} className='text-base text-gray-700 dark:text-white/70'>
                      <div className='flex items-center justify-center'>
                        {title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className=''>
                {cards.map(card => {
                  return (
                    <tr key={card._id} className='break-all !rounded md:break-keep hover:bg-gray-100 dark:hover:bg-white/10'>
                      <td className='hidden md:table-cell '>
                        <div className='flex items-center justify-center text-base text-white'>
                          {card.cardBytes}
                        </div>
                      </td>
                      <td className='hidden md:table-cell'>
                        <div className='flex items-center justify-center text-base text-white'>
                          {card.createdAt}
                        </div>
                      </td>
                      <td className='hidden md:table-cell'>
                        <div className='flex items-center justify-center text-base text-white'>
                          {card.lastVerified}
                        </div>
                      </td>
                      <td className='hidden md:table-cell'>
                        <div className='flex items-center justify-center text-base text-white'>
                          {card.verifiedCount}
                        </div>
                      </td>
                      <td>
                        <button
                          className = 'p-2 hover:bg-gray-200 dark:hover:bg-white/30 rounded-xl'
                          onClick={async () => {
                            setToggleDelete(!toggleDelete);
                            setCardToDelete(card);
                          }}
                        >
                          {trashcanSymbol()}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return (
      <div>
        <h3 className='flex items-center justify-center text-lg pt-4 text-white text-base'>
          {connected ? 'Listening for card reader activity...' : 'Client disconnected. Please reload to reconnect.'}
        </h3>
        <pre className='m-4'>
          {header}
          {logs.join('\n')}
        </pre>
      </div>
    );
  }

  return (
    <div className='overview-container bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-600 min-h-[100dvh]'>
      <h1 className='flex items-center justify-center text-white text-4xl font-bold py-4'>SCE Card Reader Page</h1>
      <pre className='flex items-center justify-center text-white text-md py-2'>This webpage manages RFID cards used to unlock the office door in the SCE room</pre>
      <div className='flex flex-row items-center justify-center text-white text-xl font-bold pt-4'>
        <button
          className={`p-2 hover:bg-gray-600 rounded-xl ${tab === 'registry' ? 'underline underline-offset-4' : ''}`}
          onClick={() => handleTabChange('registry')}
        >
          Card Registry
        </button>
        <div>&nbsp;|&nbsp;</div>
        <button
          className={`p-2 hover:bg-gray-600 rounded-xl ${tab === 'logs' ? 'underline underline-offset-4' : ''}`}
          onClick={() => handleTabChange('logs')}
        >
          Card Reader Logs
        </button>
      </div>
      {getComponentFromTabChoice(tab)}
    </div>
  );
}
