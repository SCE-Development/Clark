import React from 'react';
import { useState, useEffect } from 'react';
import { getAllFoods, createFood, deleteFood, editFood } from '../../APIFunctions/Foods';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"

export default function SCEatsAdmin(props) {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState();
  const [photo, setPhoto] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [expiration, setExpiration] = useState();

  const [photoPreview, setPhotoPreview] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editedFood, setEditedFood] = useState({
    name: "",
    photo: "",
    price: "",
    quantity: "",
    expiration: ""
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    await createFood({
      name,
      photo,
      price,
      quantity,
      expiration
    }, props.user.token);
    getFoodsFromDB();
  }

  const handleDelete = async (id) => {
    await deleteFood(id, props.user.token);
    getFoodsFromDB();
  }

  const handleEdit = (food) => {
    setEditingId(food._id);
    setEditedFood({
      name: food.name,
      photo: food.photo,
      price: food.price,
      quantity: food.quantity,
      expiration: food.expiration
    });
  };

  const handleSave = async () => {
    await editFood({ ...editedFood, _id: editingId }, props.user.token);
    getFoodsFromDB();
    setEditingId(null);
  }

  async function getFoodsFromDB() {
    const foodsFromDB = await getAllFoods();
    if (!foodsFromDB.error) {
      setFoods(foodsFromDB.responseData);
    }
  }
  useEffect(() => {
    getFoodsFromDB();
  }, []);

  const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        SCEats Admin Page
      </h1>

      <div className="mt-10 flex flex-col md:grid md:grid-cols-1 md:gap-x-6 md:gap-y-8 lg:flex lg:flex-row md:flex-wrap lg:gap-x-6 lg:gap-y-8">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="name" className='block text-sm font-medium leading-6 text-gray-300'>
            Food Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="For example, Cheetos"
              value={name}
              onChange={e => setName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="photo" className='block text-sm font-medium leading-6 text-gray-300'>
            Photo
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="photo"
              id="photo"
              value={photo}
              onChange={e => setPhoto(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="price" className='block text-sm font-medium leading-6 text-gray-300'>
            Price
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="price"
              id="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="quantity" className='block text-sm font-medium leading-6 text-gray-300'>
            Quantity
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="quantity"
              id="quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="expiration" className='block text-sm font-medium leading-6 text-gray-300'>
            Expiration Date
          </label>
          <div className="mt-2">
            <DatePicker
              name="expiration"
              id="expiration"
              selected={expiration}
              onChange={(date) => setExpiration(date)}
              dateFormat="MM-dd-y"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex mt-8">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => handleCreate()}
        >
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {foods.map(food => (
          <div key={food._id} className="border p-4 rounded-lg shadow-md">
            <img src={food.photo} alt={food.name} className="w-full h-48 object-cover rounded-md" />
            <h2 className="text-xl font-bold mt-4">
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
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
    </div>
  )
}