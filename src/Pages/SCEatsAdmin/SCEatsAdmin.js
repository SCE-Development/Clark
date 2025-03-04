import React from 'react';
import { useState, useEffect } from 'react';
import { getAllFoods, createFood, deleteFood, editFood } from '../../APIFunctions/Foods';
import 'react-datepicker/dist/react-datepicker.css';

import FoodGrid from './FoodGrid';
import FoodForm from './FoodForm';

export default function SCEatsAdmin(props) {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [photo, setPhoto] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [expiration, setExpiration] = useState();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState();
  const [foodToDelete, setFoodToDelete] = useState({
    name: '',
    type: '',
    photo: '',
    price: '',
    quantity: '',
    expiration: ''
  });

  const [deleteID, setDeleteID] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editedFood, setEditedFood] = useState({
    name: '',
    type: '',
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
      type,
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
      type: food.type,
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

  const openDeleteModal = (food) => {
    setDeleteID(food._id);
    setFoodToDelete({
      name: food.name,
      type: food.type,
      photo: food.photo,
      price: food.price,
      quantity: food.quantity,
      expiration: food.expiration
    });
    document.getElementById('confirm_delete').showModal();
  };

  useEffect(() => {
    getFoodsFromDB();
  }, []);

  function filterFoods() {
    return foods.filter(food => {
      const matchesFilter = filter && filter !== 'All' ? food.type === filter : true;
      const matchesSearchTerm = searchTerm ? food.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return matchesFilter && matchesSearchTerm;
    });
  }

  const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        SCEats Admin Page
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-6">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <button
            onClick={() => setFilter('All')}
            className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-outline'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Drink')}
            className={`btn ${filter === 'Drink' ? 'btn-primary' : 'btn-outline'}`}
          >
            Drinks
          </button>
          <button
            onClick={() => setFilter('Snack')}
            className={`btn ${filter === 'Snack' ? 'btn-primary' : 'btn-outline'}`}
          >
            Snacks
          </button>
          <button
            onClick={() => setFilter('Dessert')}
            className={`btn ${filter === 'Dessert' ? 'btn-primary' : 'btn-outline'}`}
          >
            Desserts
          </button>
          <button
            onClick={() => setFilter('Candy')}
            className={`btn ${filter === 'Candy' ? 'btn-primary' : 'btn-outline'}`}
          >
            Candy
          </button>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered max-w-xs"
          />
        </div>
      </div>

      {/*
          Field Inputs for Food name, type, photo URL, quantity, price, expiration
      */}

      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-circle btn-primary fixed bottom-4 right-4 shadow-lg w-16 h-16"
        onClick={() => document.getElementById('my_modal_3').showModal()}
      >
        <span className="text-3xl">+</span>
      </button>

      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box w-1/2 max-w-md">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn label-text btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <h3 className="font-bold text-lg">Create New Food</h3>
          <FoodForm
            setName={setName}
            setType={setType}
            setPhoto={setPhoto}
            setPrice={setPrice}
            setQuantity={setQuantity}
            expiration={expiration}
            setExpiration={setExpiration}
          />
          <button
            type="submit"
            className="rounded-md bg-indigo-600 mt-4 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleCreate()}
          >
            Save
          </button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="confirm_delete" className="modal">
        <form method="dialog" className="modal-box w-1/2 max-w-md">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <h3 className="font-bold text-lg">Delete {foodToDelete.name}?</h3>
          <p className="py-4">This action cannot be undone!</p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-error"
              onClick={() => {
                handleDelete(deleteID);
                document.getElementById('confirm_delete').close();
              }}
            >
              Delete
            </button>
            <button type="button" className="btn" onClick={() => document.getElementById('confirm_delete').close()}>
              Cancel
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/*
          Grid of Food
      */}

      <div>
        <FoodGrid
          foods={filterFoods()}
          editingId={editingId}
          editedFood={editedFood}
          setEditedFood={setEditedFood}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleSave={handleSave}
          openDeleteModal={openDeleteModal}
        />
      </div>
    </div>
  );
}
