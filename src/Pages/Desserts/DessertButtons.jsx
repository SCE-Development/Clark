// DessertCard.jsx
import React, { useState } from 'react';
import { deleteDessert, updateDessert } from '../../APIFunctions/desserts';

export default function DessertButton({ dessert, token, refreshDesserts }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(dessert.title);
  const [description, setDescription] = useState(dessert.description);
  const [rating, setRating] = useState(dessert.rating);

  const handleDelete = async () => {
    await deleteDessert(dessert._id, token);
    refreshDesserts();
  };

  const handleUpdate = async () => {
    await updateDessert(dessert._id, { title, description, rating }, token);
    setIsEditing(false);
    refreshDesserts();
  };

  return (
    <div className="border p-4 rounded-md my-2 shadow-sm">
      {isEditing ? (
        <>
          <input value={title} onChange={e => setTitle(e.target.value)} className="block mb-2" />
          <input value={description} onChange={e => setDescription(e.target.value)} className="block mb-2" />
          <input value={rating} onChange={e => setRating(e.target.value)} className="block mb-2" />
          <button onClick={handleUpdate} className="mr-2 bg-green-500 px-2 py-1 text-white">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 px-2 py-1 text-white">Cancel</button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold">{dessert.title}</h3>
          <p>{dessert.description}</p>
          <p>Rating: {dessert.rating}</p>
          <button onClick={() => setIsEditing(true)} className="mr-2 bg-yellow-500 px-2 py-1 text-white">Edit</button>
          <button onClick={handleDelete} className="bg-red-500 px-2 py-1 text-white">Delete</button>
        </>
      )}
    </div>
  );
}
