import React, { useState, useEffect } from 'react';
import { getAllDesserts } from '../../APIFunctions/Desserts';

export default function DessertPage() {
  const [desserts, setDesserts] = useState([]);

  async function getDessertsFromDB() {
    const animalsFromDB = await getAllDesserts();
    if (!animalsFromDB.error) {
      setDesserts(animalsFromDB.responseData);
    }
  };

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Welcome to the Dessert Page!!
      </h1>


      <div className="relative overflow-x-auto mt-10">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Dessert name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {desserts.map((dessert) => {
              return (
                <tr key={dessert._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {dessert.name}
                  </th>
                  <td className="px-6 py-4">
                    {dessert.description}
                  </td>
                  <td className="px-6 py-4">
                    {dessert.rating}
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