import React from 'react';
import { useState, useEffect } from 'react';
import { getAllFoods, createFood, deleteFood, editFood } from '../../APIFunctions/Foods';
import 'react-datepicker/dist/react-datepicker.css';

import FoodGrid from './FoodGrid';
import CreateFoodButton from '../../Components/Buttons/CreateFoodButton.js';
import DeleteConfirmationModal from '../../Components/Modals/DeleteConfirmationModal.js';
import FilterBar from '../../Components/FilterBar/FilterBar.js';
import SearchBar from '../../Components/SearchBar/SearchBar.js';
import CreateFoodModal from '../../Components/Modals/CreateFoodModal.js';

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

  const closeDeleteModal = () => {
    document.getElementById('confirm_delete').close();
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

  // const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        SCEats Admin Page
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-6">
        <FilterBar filter={filter} setFilter={setFilter} />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <CreateFoodButton onClick={() => document.getElementById('my_modal_3').showModal()} />
      <CreateFoodModal
        setName={setName}
        setType={setType}
        setPhoto={setPhoto}
        setPrice={setPrice}
        setQuantity={setQuantity}
        expiration={expiration}
        setExpiration={setExpiration}
        handleCreate={handleCreate}
      />
      <DeleteConfirmationModal
        foodToDelete={foodToDelete}
        deleteID={deleteID}
        handleDelete={handleDelete}
        onClose={closeDeleteModal}
      />
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
