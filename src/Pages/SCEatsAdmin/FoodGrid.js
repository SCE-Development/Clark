import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function FoodGrid({ foods, editingId, editedFood, setEditedFood, handleDelete, handleEdit, handleSave }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

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
              <p></p>
            )}
          </p>

          <h2 className="text-xl font-bold">
            {editingId === food._id ? (
              <input
                type="text"
                value={editedFood.name}
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
          <p className="text-white-700 mt-1">
            Price: ${editingId === food._id ? (
              <input
                type="text"
                value={editedFood.price}
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
            <div className="flex space-x-2">
              {editingId === food._id ? (
                <button
                  className="rounded-md bg-indigo-600 mt-1 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => handleSave()}>Save</button>
              ) : (
                <>
                  <button onClick={() => handleEdit(food)} className="bg-blue-500 text-white px-2 py-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0" /></path><path stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0" /></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0" /></path></g></svg>
                  </button>
                  <button onClick={async () => handleDelete(food._id)} className="bg-red-500 text-white px-2 py-2 rounded-md">
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

