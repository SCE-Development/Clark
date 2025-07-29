import { useState, useEffect, useMemo } from 'react';
import { BASE_API_URL } from '../../Enums';
import { useUser } from '../../Components/context/UserContext';
import { getAllCardsFromDb, deleteCardFromDb } from '../../APIFunctions/CardReader';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal';
import { trashcanSymbol } from '../Overview/SVG';

const header = [
  'Time'.padEnd(29),
  'Endpoint'.padEnd(38),
  'Method'.padEnd(8),
  'Code'.padEnd(7),
  'Event'.padEnd(21),
  'Alias'.padEnd(15)
].join('');

export default function CardReader() {
  const { user } = useUser();
  const token = user.token;
  const [logs, setLogs] = useState([]);
  const [cards, setCards] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [cardToDelete, setCardToDelete] = useState({});
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'registry';
  });
  const [connected, setConnected] = useState(true);
  const [connectionStatusText, setConnectionStatusText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [paginationText, setPaginationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState('Card Registry');
  const getSelectedClassName = (selected, tab, label, tabKey) => {
    let className = 'p-2 hover:bg-gray-400 rounded-xl ';
    if (selected === label) {
      className += 'text-blue-500 ';
    } else {
      className += 'dark:text-white text-gray-700 ';
    }
    if (tab === tabKey) {
      className += 'underline underline-offset-4 ';
    }
    return className.trim();
  };

  function buildLog(data) {
    const time = new Date().toISOString().padEnd(29);
    const endpoint = data.endpoint.padEnd(38);
    const method = data.requestType.padEnd(8);
    const code = String(data.statusCode).padEnd(7);
    const event = data.message.padEnd(21);
    const alias = data.alias.padEnd(15);
    return [time, endpoint, method, code, event, alias].join('');
  }

  const getColumnClassName = (columnName) => {
    let className = 'px-6 py-3 whitespace-nowrap ';
    if(columnName === 'lastVerifiedAt' | columnName === 'registrationDate'){
      className += 'hidden md:table-cell ';
    } else if (columnName === 'verifiedCount'){
      className += 'hidden lg:table-cell';
    }
    return className;
  };

  async function getAllCards() {
    setLoading(true);
    const apiResponse = await getAllCardsFromDb({
      token,
      page,
    });
    if (!apiResponse.error) {
      setCards(apiResponse.responseData.items);
      setTotal(apiResponse.responseData.total);
      setRowsPerPage(apiResponse.responseData.rowsPerPage);
    }
    setLoading(false);
  }

  function handleTabChange(newTab) {
    setTab(newTab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', newTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }

  function handleDeleteClick(card) {
    setToggleDelete(!toggleDelete);
    setCardToDelete(card);
  }

  function CardEntry({ card }) {
    return (
      <tr key={card._id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
        <td key='alias' className=''>
          <div className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
            {card.alias}
          </div>
        </td>
        <td key='createdAt' className='hidden md:table-cell'>
          <div className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            {card.createdAt}
          </div>
        </td>
        <td key='lastVerified' className='hidden md:table-cell'>
          <div className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
            {card.lastVerified}
          </div>
        </td>
        <td key='verifiedCount' className='hidden lg:table-cell'>
          <div className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
            {card.verifiedCount}
          </div>
        </td>
        <td>
          <button
            className='p-2 hover:bg-gray-200 dark:hover:bg-white/30 rounded-xl'
            onClick={() => handleDeleteClick(card)}
          >
            {trashcanSymbol('#e64539')}
          </button>
        </td>
      </tr>
    );
  }

  useEffect(() => {
    getAllCards();
    const url = new URL('/api/OfficeAccessCard/listen', BASE_API_URL);
    url.searchParams.append('token', token);
    const eventSource = new EventSource(url.href);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const url = new URL(data.endpoint, window.location.origin);
        // if card is verified or added successfully, query the DB again to get latest card data
        if (url.pathname === '/verify' && data.statusCode === 200) {
          getAllCards();
        }
        const newLog = buildLog(data);
        setLogs(currLogs => [newLog, ...currLogs]);
      } catch (err) { // if the message sent from error cannot be parsed
        setLogs(
          (currLogs) => [
            '[error] unable to format response, check browser logs',
            ...currLogs,
          ]
        );
      }
    };

    eventSource.onerror = () => { // if the connection to the event source encounters error
      setLogs(
        (currLogs) => [
          'EventSource didn\'t work, check browser logs',
          ...currLogs
        ]
      );
      setConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (connected) {
      setConnectionStatusText('Listening for card reader activity...');
      return;
    }
    setConnectionStatusText('Client disconnected. Please reload to reconnect.');
  }, [connected]);

  useEffect(() => {
    const amountOfCardsOnCurrentPage = Math.min((page + 1) * rowsPerPage, cards.length);
    const pageOffset = page * rowsPerPage;
    const startingElementNumber = (page * rowsPerPage) + 1;
    const endingElementNumber = amountOfCardsOnCurrentPage + pageOffset;
    setPaginationText(
      <>
        <p className='md:hidden text-gray-700 dark:text-white'>
          {startingElementNumber} - {endingElementNumber} / {total}
        </p>
        <p className="hidden md:inline-block text-gray-700 dark:text-white">
          Showing <span className='font-medium'>{startingElementNumber}</span> to <span className='font-medium'>{endingElementNumber}</span> of <span className='font-medium'>{total}</span> results
        </p>
      </>
    );
  }, [page, rowsPerPage, cards, total]);

  useEffect(() => {
    getAllCards();
  }, [page]);

  function maybeRenderPagination() {
    const amountofCardsOnCurrentPage = Math.min((page + 1) * rowsPerPage, cards.length);
    const pageOffset = page * rowsPerPage;
    const endingElementNumber = amountofCardsOnCurrentPage + pageOffset;
    if (cards.length) {
      return (
        <nav className='flex justify-start py-6 mx-4'>
          <div className='flex items-center navbar-start'>
            <span className="text-gray-700 dark:text-white">
              {loading ? '...' : paginationText}
            </span>
          </div>
          <div className='flex justify-end space-x-3 navbar-end'>
            <button
              className='btn btn-neutral text-gray-800 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600'
              onClick={() => setPage(page - 1)}
              disabled={page === 0 || loading}
            >
              previous
            </button>
            <button
              className='btn btn-neutral text-gray-800 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600'
              onClick={() => setPage(page + 1)}
              disabled={endingElementNumber >= total || loading}
            >
              next
            </button>
          </div>
        </nav>
      );
    }
    return <></>;
  }

  function maybeRenderTable() {
    if (cards.length === 0) {
      return (
        <h3 className='text-center text-lg pt-4 text-gray-700 dark:text-white text-base'>
          Looks like there are no registered cards...
        </h3>
      );
    }
    return (
      <div className='overflow-x-auto overflow-y-auto w-full'>
        <table className='m-full min-w-full text-gray-700 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr className=''>
              {[
                { title: 'Alias', columnName: 'alias' },
                { title: 'Registration Date', columnName: 'registrationDate' },
                { title: 'Last Verified At', columnName: 'lastVerifiedAt' },
                { title: 'Verified Count', columnName: 'verifiedCount' },
                { title:'', columnName: '' }
              ].map(({ title, columnName }) => (
                <th key={title}
                  className={getColumnClassName(columnName)}
                >
                  <div className='flex items-center justify-center'>
                    {title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='text-center text-sm'>
            {cards.map((card) => {
              return <CardEntry key={card._id} card={card} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function getComponentFromTabChoice(tab) {
    if (tab === 'registry') {
      return (
        <div>
          <ConfirmationModal {... {
            headerText: `Delete card: ${cardToDelete.alias}?`,
            bodyText: `Are you sure you want to delete 
              card: ${cardToDelete.alias}? It'll be gone forever if you do.`,
            confirmText: `Yes, delete ${cardToDelete.alias}`,
            cancelText: 'No, keep the card',
            confirmClassAddons: 'bg-red-600 hover:bg-red-500',
            handleConfirmation: async () => {
              await deleteCardFromDb(token, cardToDelete.alias);
              await getAllCards();
              setToggleDelete(!toggleDelete);
            },
            open: toggleDelete
          }
          } />
          <div className='flex flex-col m-6'>
            {maybeRenderTable()}
            {maybeRenderPagination()}
          </div>
        </div>
      );
    }
    return (
      <div>
        <h3 className='text-center text-lg py-2 pt-4 text-gray-700 dark:text-white text-base'>
          {connectionStatusText}
        </h3>
        <pre className='overflow-x-auto m-4 text-gray-700 dark:text-white'>
          {header}
          {logs.map((log, index) => (
            <div key={index} className='border-b border-gray-300 py-1'>{log}</div>
          ))}
        </pre>
      </div>
    );
  }

  return (
    <div className='overview-container bg-gray min-h-[100dvh]'>
      <h1 className='text-center text-gray-700 dark:text-white text-4xl font-bold py-4'>SCE Card Reader Page</h1>
      <pre className='whitespace-normal text-center max-w-[90%] mx-auto text-gray-700 dark:text-white font-normal py-2'>This webpage manages RFID cards used to unlock the office door in the SCE room</pre>
      <div className='flex flex-row items-center justify-center text-gray-700 dark:text-white text-xl font-bold pt-4'>
        <button
          className={getSelectedClassName(selected, tab, 'Card Registry', 'registry')}
          onClick={() => {
            handleTabChange('registry');
            setSelected('Card Registry');
          }}
        >
          Card Registry
        </button>
        {/* spacer to differentiate between the two options */}
        <div>&nbsp;|&nbsp;</div>
        <button
          className={getSelectedClassName(selected, tab, 'Card Reader Logs', 'logs')}
          onClick={() => {
            handleTabChange('logs');
            setSelected('Card Reader Logs');
          }}
        >
          Card Reader Logs
        </button>
      </div>
      {getComponentFromTabChoice(tab)}
    </div>
  );
}
