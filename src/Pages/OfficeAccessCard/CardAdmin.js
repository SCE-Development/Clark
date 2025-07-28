import { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../Enums';
import { useUser } from '../../Components/context/UserContext';
import { EventListening } from './EventListening.js';
import { CardDisplay } from './CardHandling.js';
import { getAllCardsFromDb, deleteCardFromDb } from '../../APIFunctions/OfficeAccessCard.js';

export default function CardAdminPage() {
const [messages, setMessages] = useState([]);
const [buttonName, setButtonName] = useState('View Events');
const [cards, setCards] = useState([]);
const [showCardHandling, setShowCardHandling] = useState(true);
const { user } = useUser();
const token = user.token;

useEffect(() => {

    const url = new URL('/api/OfficeAccessCard/listen', BASE_API_URL);
    url.searchParams.append('token', token);

    const eventSource = new EventSource(url.href);

    eventSource.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        const eventMessage = [
        `${data.requestTime}`.padEnd(29),
        `${data.endpoint.slice(21)}`.padEnd(38),
        `${data.requestType}`.padEnd(8),
        `${data.responseCode}`.padEnd(7),
        `${data.logResponse}`.padEnd(21),
        `${data.cardAlias}`.padEnd(20)
        ].join('');
        setMessages(prev => [eventMessage, ...prev]);
    } catch (e) {
        setMessages(prev => [e, ...prev]);
    }
    };

    return () => {
    eventSource.close();
    };
}, []);

async function fetchCards(token) {
    const allCards = await getAllCardsFromDb({ token });
    setCards(allCards.responseData);
}

useEffect(() => {
    fetchCards(token);
}, [token]);

useEffect(() => {
    console.log(cards);
}, [cards]);


const togglePageView = () => {
    setShowCardHandling(prev => !prev);
    if (buttonName === 'View Events') {
        setButtonName('Card Handling');
    } else {
        setButtonName('View Events');
    }
};

const handleDelete = async (cardBytes) => {
    const status = await deleteCardFromDb(token, cardBytes);
    if (!status.error) {
        const filtered = cards.filter((card) => card.cardBytes !== cardBytes);
        setCards(filtered);
    }
}

return (
    <div className='m-10'>
    <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        Office Access Card Admin Page
    </h1>
    <div className='flex justify-center pt-8 pb-8'>
        <button
            onClick={togglePageView}
            className='px-4 py-2 bg-base-200 hover:bg-gray-100 dark:hover:bg-gray-700 group text-white rounded'
        >
            {buttonName}
        </button>
    </div>
    {showCardHandling ? <CardDisplay cards={cards} onDeleteCard={handleDelete}/> : <EventListening messages={messages}/>}
    </div>
);
}
