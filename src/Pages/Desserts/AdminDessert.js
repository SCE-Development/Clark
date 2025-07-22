import React, { useEffect, useState } from 'react';
import { getAllDesserts, createDessert, editDessert, deleteDessert } from '../../APIFunctions/desserts.js';
import { useUser } from '../../Components/context/UserContext';

export default function DessertPage() {
  const [desserts, setDesserts] = useState([]);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState('');
  const { user } = useUser();

  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  const INPUT_CLASS =
    'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-grey';

  return (
    <div className="m-10">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-grey">
        Welcome to the Dessert Admin Page!!
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-full sm:grid-cols-6">
        <div className="col-span-full sm:col-span-4">
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-300">
            Dessert Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="title"
              placeholder="For example, Cookie"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="col-span-full sm:col-span-4">
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-300">
            Description
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="col-span-full sm:col-span-4">
          <label htmlFor="rating" className="block text-sm font-medium leading-6 text-gray-300">
            Rating
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="col-span-full sm:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={async () => {
              await createDessert({ title, description, rating: Number(rating) }, user.token);
              setTitle('');
              setDescription('');
              setRating('');
              await getDessertsFromDB();
            }}
          >
            create
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Dessert
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Rating
            </th>
            <th scope="col" className="px-6 py-3">
              Custom
            </th>
          </tr>
        </thead>
        <tbody>
          {desserts.map((dessert) => (
            <tr key={dessert._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {dessert.title || 'N/A'}
              </td>
              <td className="px-6 py-4">{dessert.description || 'N/A'}</td>
              <td className="px-6 py-4">{dessert.rating ?? 'N/A'}</td>
              <td className="px-6 py-4 space-x-2">
                <button
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={async () => {
                    await deleteDessert({ _id: dessert._id }, user.token);
                    await getDessertsFromDB();
                  }}
                >
                  Delete
                </button>
                <button
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={async () => {
                    await editDessert(
                      {
                        _id: dessert._id,
                        title,
                        description,
                        rating: Number(rating),
                      },
                      user.token
                    );
                    setTitle('');
                    setDescription('');
                    setRating('');
                    await getDessertsFromDB();
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
