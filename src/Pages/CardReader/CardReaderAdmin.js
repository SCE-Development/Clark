import React from 'react'
import { useEffect, useState } from 'react'
import { getAllCards } from '../../APIFunctions/CardReader';
  
export default function CardReaderAdminPage () {
  const [eventData, setEventData] = useState([])
  const [cards, setCards] = useState([]);

  async function getCardsFromDB() {
    const cardsFromDB = await getAllCards();
    if (!cardsFromDB.error) {
      setCards(cardsFromDB.responseData);
    }
  }

  useEffect(() => {
    getCardsFromDB();
    console.log(cards);
  }, []);

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
    <div className='m-10'>
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Card Reader Admin Page
        </h1>

         <div className="relative overflow-x-auto mt-10">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Card Bytes
                </th>
                <th scope="col" className="px-6 py-3">
                  Verified Count
                </th>
                <th scope="col" className="px-6 py-3">
                  Last Verified
                </th>
                <th scope="col" className="px-6 py-3">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => {
                return (
                  <tr key={card._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {card.createdAt}
                    </th>
                    <td className="px-6 py-4">
                      {card.cardBytes}
                    </td>
                    <td className="px-6 py-4">
                      {card.verifiedCount}
                    </td>
                    <td className="px-6 py-4">
                      {card.lastVerified}
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {eventData.map((event) => (
          <pre>{JSON.parse(event).ISO_date} {JSON.parse(event).endpoint} {JSON.parse(event).response_code} {JSON.parse(event).response_string} {JSON.parse(event).cardBytes}</pre>
        ))}
    </div>
  )
}


