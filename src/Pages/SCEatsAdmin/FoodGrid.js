import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EditButton from '../../Components/Buttons/EditButton';

export default function FoodGrid({ foods, editingId, editedFood, setEditedFood, handleDelete, handleEdit, handleSave, openDeleteModal }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

      {foods.map(food => (
        <div key={food._id} className="border p-4 rounded-lg shadow-md">

          <img
            src={food.photo}
            alt={food.name}
            className={editingId === food._id ? 'w-full h-40 object-cover rounded-md' : 'w-full h-48 object-cover rounded-md'}
          />

          <p className="flex text-white-700 mt-1">
            {editingId === food._id ? (
              <>
                <input
                  type="text"
                  value={editedFood.photo}
                  onChange={e =>
                    setEditedFood({
                      ...editedFood,
                      photo: e.target.value,
                    })
                  }
                  className="indent-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white"
                />
              </>
            ) : (
              <span></span>
            )}
          </p>

          <h2 className="text-xl font-bold">
            {editingId === food._id ? (
              <input
                type="text"
                value={editedFood.name}
                maxLength={50}
                onChange={e =>
                  setEditedFood({
                    ...editedFood,
                    name: e.target.value,
                  })
                }
              />
            ) : (
              food.name
            )}
          </h2>

          <p className="flex text-white-700 mt-1">
            Type: {editingId === food._id ? (
              <>
                <select value = {editedFood.type} onChange={e => setEditedFood({...editedFood, type: e.target.value})} className="select select-bordered select-xs mt-0.5 w-full max-w-md">
                  <option selected>All</option>
                  <option>Drink</option>
                  <option>Snack</option>
                  <option>Dessert</option>
                  <option>Candy</option>
                </select>
              </>
            ) : (
              food.type
            )}
          </p>

          <p className="text-white-700 mt-1">
            Price: ${editingId === food._id ? (
              <input
                type="text"
                value={editedFood.price}
                maxLength={5}
                onChange={e =>
                  setEditedFood({
                    ...editedFood,
                    price: e.target.value,
                  })
                }
              />
            ) : (
              food.price.toFixed(2)
            )}
          </p>

          <p className="text-white-700 mt-1">
            Quantity: {editingId === food._id ? (
              <input
                type="text"
                value={editedFood.quantity}
                maxLength={5}
                onChange={e =>
                  setEditedFood({
                    ...editedFood,
                    quantity: e.target.value,
                  })
                }
              />
            ) : (
              food.quantity
            )}
          </p>

          <div className="flex justify-between items-center">
            <p className="text-white-700">
              Expiration: {editingId === food._id ? (
                <DatePicker
                  selected={editedFood.expiration}
                  onChange={(date) =>
                    setEditedFood({
                      ...editedFood,
                      expiration: date
                    })
                  }
                  dateFormat="MM-dd-y"
                />
              ) : (
                food.expiration ? new Date(food.expiration).toLocaleDateString() : 'N/A'
              )}
            </p>

            <div className="flex space-x-2 mr-2">
              {editingId === food._id ? (
                <button
                  className="rounded-md bg-indigo-600 mt-1 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => handleSave()}>Save</button>
              ) : (
                <>
                  <EditButton onClick={() => handleEdit(food)} />
                  <button onClick={() => openDeleteModal(food)} className="bg-red-500 text-white px-2 py-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

