import React, { useState, useEffect } from 'react';
import { getAllDesserts, createDessert, deleteDessert, editDessert} from '../../APIFunctions/Desserts';
import { useUser } from '../../Components/context/UserContext';

export default function AdminDessertPage() {
  const [desserts, setDesserts] = useState([]);
  const [description, setDescription] = useState();
  const [name, setName] = useState();
  const [rating, setRating] = useState();
  const [isEditing, setEditing] = useState();
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('')
  const { user } = useUser();

  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
    checkDessertsExist(dessertsFromDB.responseData);
  }

  async function checkDessertsExist(dess){
    if(dess.length == 0) {
      document.getElementById('no desserts').style.display = 'block';
      document.getElementById('table').style.display = 'none'; 
    }else{
      document.getElementById('table').style.display =  'block';
      document.getElementById('no desserts').style.display = 'none';
    }
  }

  async function handleEditButton() {
    setEditing(!isEditing);
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';
  const EDIT_INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-white';
  return (
    <div className='m-10'>
      <h1 class="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Welcome to the Dessert Admin Page!!
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-full sm:grid-cols-6">
        <div className="col-span-full sm:col-span-4">
          <label htmlFor="name" className='block text-sm font-medium leading-6 text-gray-300'>
            Dessert Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="For example, Cookies"
              value={name}
              onChange={e => setName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="col-span-full sm:col-span-4">
          <label htmlFor="description" className='block text-sm font-medium leading-6 text-gray-300'>
            Description
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="description"
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="col-span-full sm:col-span-4">
          <label htmlFor="rating" className='block text-sm font-medium leading-6 text-gray-300'>
            Rating
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="rating"
              id="rating"
              value={rating}
              onChange={e => setRating(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="col-span-full sm:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => createDessert({
              name,
              description,
              rating,
            }, user.token)}
          >
            Save
          </button>
        </div>
      </div>

      <h1 id="no desserts" style={{display: 'none'}}> No Desserts ! </h1>

      <div className="relative overflow-x-auto mt-10" id = "table">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Dessert name
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
            </tr>
          </thead>
          <tbody>
            {desserts.map((dessert) => {
              return (
                <tr key={dessert._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  {isEditing ? (
                      <th>
                        <input
                          type="text"
                          name="editName"
                          id="editName"
                          placeholder="For example, Cookies"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className={EDIT_INPUT_CLASS}/>
                      <td>
                        <input
                          type="text"
                          name="editDescription"
                          id="editDescription"
                          value={editDescription}
                          onChange={e => setEditDescription(e.target.value)}
                          className={EDIT_INPUT_CLASS}/>
                      </td>
                        <td>
                          <button className="btn mt-3 px-6 py-4 bg-yellow-300 hover:bg-yellow-200 text-black" 
                          onClick={() => editDessert(
                            {"name":document.getElementById('editName').value},
                          {"description":document.getElementById('editDescription').value},
                          {"rating": dessert.rating},
                          {"_id": dessert._id}
                          )}>Save</button>
                        </td>
                      </th>
                  ) : (
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {dessert.name}

                      <td className="px-6 py-4">
                        Description: {dessert.description}
                      </td>
                    </th>
                  )} 
                  <td>
                    <button className="btn mt-3 px-6 py-4 bg-yellow-300 hover:bg-yellow-200 text-black" onClick={() => handleEditButton(dessert)}>Edit</button>
                  </td>
                  <td>
                    <button className="btn px-6 py-4 bg-red-500 text-black hover:bg-red-400" onClick = {() => deleteDessert(dessert)}>Delete</button>
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

