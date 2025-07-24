import { useEffect, useState } from 'react'
import { getAllCards } from '../../APIFunctions/CardReader';
  
export default function CardReaderAdminPage () {
  const [eventData, setEventData] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState('stored');
  
  async function getCardsFromDB() {
    const cardsFromDB = await getAllCards();
    if (!cardsFromDB.error) {
      setCards(cardsFromDB.responseData);
    }
  }

  useEffect(() => {
    getCardsFromDB();
    
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/api/OfficeAccessCard/listen');
    eventSource.onmessage = function(event) {
        console.log(JSON.parse(event.data));
        setEventData(prev => [...prev, event.data])
    };

    eventSource.onerror = function(event) {
    };

    return () => eventSource.close();
  }, []);
  
  return (
    <div className='m-10'>
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Card Reader Admin Page
          
        </h1>

        <div className="my-5 text-xl flex space-x-8">
          <button
            onClick={() => setActiveTab('stored')}
            className={`pb-2 transition ${
              activeTab === 'stored' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Stored Cards
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-2 transition ${
              activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Activity
          </button>
        </div>
        {activeTab === 'stored' ? 
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
                  Alias
                </th>
                <th scope="col" className="px-6 py-3"/> 
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => {
                return (
                  <tr key={card._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  {console.log(cards)}
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
                      {card.alias}
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
                        onClick={() => (
                          fetch("http://localhost:8080/api/OfficeAccessCard/delete", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ cardBytes: card.cardBytes })
                          })
                          .then(res => {
                            if (!res.ok) throw new Error("Failed to delete");
                            console.log("Deleted successfully");
                          })
                          .catch(err => {
                            console.error("Error deleting card:", err);
                          })
                          
                        )}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

         : 

        <div className="relative overflow-x-auto mt-10">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ISO_Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Endpoint
                </th>
                <th scope="col" className="px-6 py-3">
                  Response Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Response String
                </th>
                <th scope="col" className="px-6 py-3">
                  Card Bytes
                </th>
                <th scope="col" className="px-6 py-3">
                  Alias
                </th>
              </tr>
            </thead>
            <tbody>
              {eventData.map((event) => {
                return (
                  <tr key={event._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {JSON.parse(event).ISO_date}
                    </th>
                    <td className="px-6 py-4">
                      {JSON.parse(event).endpoint}
                    </td>
                    <td className="px-6 py-4">
                      {JSON.parse(event).response_code}
                    </td>
                    <td className="px-6 py-4">
                      {JSON.parse(event).response_string}
                    </td>
                    <td className="px-6 py-4">
                      {JSON.parse(event).cardBytes}
                    </td>
                    <td className="px-6 py-4">
                      {JSON.parse(event).alias}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>}
    
  
    </div>
  )
}


