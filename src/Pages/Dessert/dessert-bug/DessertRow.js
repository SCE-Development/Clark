    import React, { useState } from 'react';
    import { updateDessert } from '../../APIFunctions/Dessert';

    export default function DessertRow({ dessert, user, refreshDesserts }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(dessert.title);
    const [description, setDescription] = useState(dessert.description);

    async function handleSave() {
        console.log("handleSave test", { title, description });
        const updatedDessert = {
        _id: dessert._id,
        title,
        description,
        };

        const result = await updateDessert(updatedDessert, user.token);
        if (!result.error) {
        setIsEditing(false);
        refreshDesserts();
        } else {
        console.error(result.responseData);
        }
    }

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {isEditing ? (
            <input
                className="text-black px-2 py-1 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            ) : (
            dessert.title
            )}
        </td>
        <td className="px-6 py-4">
            {isEditing ? (
            <input
                className="text-black px-2 py-1 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            ) : (
            dessert.description
            )}
        </td>
        <td className="px-6 py-4">
            {isEditing ? (
            <>
                <button onClick={handleSave} className="text-green-500 mr-2">
                Save
                </button>
                <button onClick={() => setIsEditing(false)} className="text-yellow-500">
                Cancel
                </button>
            </>
            ) : (
            <button onClick={() => setIsEditing(true)} className="text-blue-500">
                Edit
            </button>
            )}
        </td>
        </tr>
    );
    }
