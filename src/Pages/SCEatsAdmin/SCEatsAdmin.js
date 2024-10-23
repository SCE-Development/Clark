import React from 'react';
import { useState, useEffect } from 'react';
import { getAllFoods, createFood, deleteFood, editFood } from '../../APIFunctions/Foods';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import FoodGrid from './FoodGrid';

export default function SCEatsAdmin(props) {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState();
  const [photo, setPhoto] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [expiration, setExpiration] = useState();

  const [editingId, setEditingId] = useState(null);
  const [editedFood, setEditedFood] = useState({
    name: '',
    photo: '',
    price: '',
    quantity: '',
    expiration: ''
  });

  async function getFoodsFromDB() {
    const foodsFromDB = await getAllFoods();
    if (!foodsFromDB.error) {
      setFoods(foodsFromDB.responseData);
    }
  }

  const handleCreate = async () => {
    await createFood({
      name,
      photo,
      price,
      quantity,
      expiration
    }, props.user.token);
    getFoodsFromDB();
  };

  const handleDelete = async (id) => {
    await deleteFood(id, props.user.token);
    getFoodsFromDB();
  };

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
  };

  useEffect(() => {
    getFoodsFromDB();
  }, []);

  const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        SCEats Admin Page
      </h1>

      {/*
          Field Inputs for Food name, photo URL, quantity, price, expiration
      */}

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
          className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => handleCreate()}
        >
          Save
        </button>
      </div>

      {/*
          Grid of Food
      */}

      <div>
        <FoodGrid
          foods = {foods}
          editingId={editingId}
          editedFood={editedFood}
          setEditedFood={setEditedFood}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
}
