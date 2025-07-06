import { useState, useEffect, useMemo } from 'react';
import { BASE_API_URL } from '../../Enums';
import { useUser } from '../../Components/context/UserContext';
import { getAllCardsFromDb, deleteCardFromDb } from '../../APIFunctions/CardReader';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal';
import { trashcanSymbol } from '../Overview/SVG';

const header = [
  'TIMESTAMP'.padEnd(30),
  'TYPE'.padEnd(12),
  'ENDPOINT'.padEnd(20),
  'STATUS CODE'.padEnd(15),
  'MESSAGE\n'
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
  const [currentSortColumn, setCurrentSortColumn] = useState('verifiedCount');
  const [currentSortOrder, setCurrentSortOrder] = useState('desc');
  const [query, setQuery] = useState('');

  function buildLog(data) {
    const date = new Date().toISOString().padEnd(30);
    const requestType = data.requestType.padEnd(12);
    const endpoint = data.endpoint.padEnd(20);
    const statusCode = String(data.statusCode).padEnd(15);
    return [date, requestType, endpoint, statusCode, data.message].join('');
  }

  async function getAllCards() {
    setLoading(true);
    const sortColumn = currentSortOrder === 'none' ? 'registrationDate' : currentSortColumn;
    const sortOrder = currentSortOrder === 'none' ? 'desc' : currentSortOrder;
    const apiResponse = await getAllCardsFromDb({
      token,
      query,
      page,
      sortColumn,
      sortOrder,
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

  function handleSortCards(columnName) {
    if (columnName === null) {
      return;
    }
    if (currentSortColumn === columnName) {
      if (currentSortOrder === 'asc') {
        setCurrentSortOrder('desc');
      } else if (currentSortOrder === 'desc') {
        setCurrentSortOrder('none');
      } else {
        setCurrentSortOrder('asc');
      }
    } else {
      setCurrentSortColumn(columnName);
      setCurrentSortOrder('asc');
    }
  }

  function handleArrowVisibility(sortOrder, columnName) {
    if (currentSortOrder === sortOrder && currentSortColumn === columnName) {
      return '';
    }
    return 'hidden';
  }

  function CardEntry({ card }) {
    return (
      <tr key={card._id} className='break-all !rounded md:break-keep hover:bg-gray-100 dark:hover:bg-white/10'>
        <td className='hidden md:table-cell '>
          <div className='flex items-center justify-center text-base text-gray-700 dark:text-white'>
            {card.cardBytes}
          </div>
        </td>
        <td className='hidden md:table-cell'>
          <div className='flex items-center justify-center text-base text-gray-700 dark:text-white'>
            {card.createdAt}
          </div>
        </td>
        <td className='hidden md:table-cell'>
          <div className='flex items-center justify-center text-base text-gray-700 dark:text-white'>
            {card.lastVerified}
          </div>
        </td>
        <td className='hidden md:table-cell'>
          <div className='flex items-center justify-center text-base text-gray-700 dark:text-white'>
            {card.verifiedCount}
          </div>
        </td>
        <td>
          <button
            className = 'p-2 hover:bg-gray-200 dark:hover:bg-white/30 rounded-xl'
            onClick={() => handleDeleteClick(card)}
          >
            {trashcanSymbol()}
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

    eventSource.onerror = (error) => { // if the connection to the event source encounters error
      console.log(error);
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
  }, [page, currentSortColumn, currentSortOrder, query]);

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

  function getComponentFromTabChoice(tab) {
    if (tab === 'registry') {
      return (
        <div>
          <ConfirmationModal {... {
            headerText: `Delete card: ${cardToDelete.cardBytes}?`,
            bodyText: `Are you sure you want to delete 
              card: ${cardToDelete.cardBytes}? It'll be gone forever if you do.`,
            confirmText: `Yes, delete ${cardToDelete.cardBytes}`,
            cancelText: 'No, keep the card',
            confirmClassAddons: 'bg-red-600 hover:bg-red-500',
            handleConfirmation: async () => {
              await deleteCardFromDb(token, cardToDelete.cardBytes);
              await getAllCards();
              setToggleDelete(!toggleDelete);
            },
            open: toggleDelete
          }
          } />
          <div className='flex flex-col m-6'>
            <div className='py-2'>
              <label className="w-full form-control">
                <div className="label">
                  <span className="label-text text-md text-gray-700 dark:text-white">Type a search, followed by the enter key</span>
                </div>
                <input
                  className="w-full text-sm input input-bordered text-gray-900 dark:text-white sm:text-base"
                  type="text"
                  placeholder="search by card bytes"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      if (page) {
                        setPage(0);
                      } else {
                        getAllCards();
                      }
                    }
                  }}
                  onChange={event => {
                    setQuery(event.target.value);
                  }}
                />
              </label>
            </div>
            <table className='table px-3'>
              <thead>
                <tr>
                  {[
                    { title: 'Card Bytes', columnName: 'cardBytes' },
                    { title: 'Registration Date', columnName: 'registrationDate' },
                    { title: 'Last Verified At', columnName: 'lastVerifiedAt' },
                    { title: 'Verified Count', columnName: 'verifiedCount' }
                  ].map(({ title, columnName = null }) => (
                    <th key={title} className='text-base text-gray-700 dark:text-white/70 text-center'>
                      <div className='flex items-center justify-center'>
                        <button onClick={() => handleSortCards(columnName)}>{title}</button>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className={`w-5 h-5 ${handleArrowVisibility('asc', columnName)}`}>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M12 19.5V4.5m0 0l-6 6m6-6l6 6' />
                        </svg>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className={`w-5 h-5 ${handleArrowVisibility('desc', columnName)}`}>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m0 0l6-6m-6 6l-6-6' />
                        </svg>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cards.map(card => <CardEntry card={card}/>)}
              </tbody>
            </table>
            {maybeRenderPagination()}
          </div>
        </div>
      );
    }
    return (
      <div>
        <h3 className='flex items-center justify-center text-lg pt-4 text-gray-700 dark:text-white text-base'>
          {connectionStatusText}
        </h3>
        <pre className='m-4 text-gray-700 dark:text-white'>
          {header}
          {logs.join('\n')}
        </pre>
      </div>
    );
  }

  return (
    <div className='overview-container bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-600 min-h-[100dvh]'>
      <h1 className='flex items-center justify-center text-gray-700 dark:text-white text-4xl font-bold py-4'>SCE Card Reader Page</h1>
      <pre className='flex items-center justify-center text-gray-700 dark:text-white text-md py-2'>This webpage manages RFID cards used to unlock the office door in the SCE room</pre>
      <div className='flex flex-row items-center justify-center text-gray-700 dark:text-white text-xl font-bold pt-4'>
        <button
          className={`p-2 hover:bg-gray-400 rounded-xl ${tab === 'registry' ? 'underline underline-offset-4' : ''}`}
          onClick={() => handleTabChange('registry')}
        >
          Card Registry
        </button>
        {/* spacer to differentiate between the two options */}
        <div>&nbsp;|&nbsp;</div>
        <button
          className={`p-2 hover:bg-gray-400 rounded-xl ${tab === 'logs' ? 'underline underline-offset-4' : ''}`}
          onClick={() => handleTabChange('logs')}
        >
          Card Reader Logs
        </button>
      </div>
      {getComponentFromTabChoice(tab)}
    </div>
  );
}
