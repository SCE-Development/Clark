import React from 'react';
import { useState, useEffect } from 'react';
import { getAllFoods, createFood } from '../../APIFunctions/Foods';

export default function SCEatsAdmin(props) {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState();
  const [photo, setPhoto] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [expiration, setExpiration] = useState();


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

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-full sm:grid-cols-6">
        <div className="col-span-full sm:col-span-4">
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
        <div className="col-span-full sm:col-span-4">
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
        
        <div className="col-span-full sm:col-span-4">
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
        <div className="col-span-full sm:col-span-4">
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

        <div className="col-span-full sm:col-span-4">
          <label htmlFor="expiration" className='block text-sm font-medium leading-6 text-gray-300'>
            Expiration Date
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="expiration"
              id="expiration"
              value={expiration}
              onChange={e => setExpiration(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="col-span-full sm:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => createFood({
              name,
              photo,
              price,
              quantity,
              expiration
            }, props.user.token)}
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {foods.map(food => (
          <div key={food._id} className="border p-4 rounded-lg shadow-md">
            <img src={food.photo} alt={food.name} className="w-full h-48 object-cover rounded-md" />
            <h2 className="text-xl font-bold mt-4">{food.name}</h2>
            <p className="text-gray-700">Price: ${food.price.toFixed(2)}</p>
            <p className="text-gray-700">Quantity: {food.quantity}</p>
            <p className="text-gray-700">Expiration: {new Date(food.expiration).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}