import React, { useState, useEffect } from 'react';

import { editDessert, deleteDessert } from '../../APIFunctions/Dessert';

const TABLE_ROW_STYLE = "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
export default function DesertItem(props) {
    const [editing, setEditing] = useState();
    const [visible, setVisible] = useState(true);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [rating, setRating] = useState();
    const dessert = props.dessert
    return dessert ? (
        <tr key={dessert._id} className={visible ? TABLE_ROW_STYLE : "hidden"}>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                {editing ? (
                    <input
                        name="title"
                        placeholder={dessert.title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: `${Math.max(dessert.title.length + 2, 1)}ch` }}
                        className="input input-bordered input-sm w-full" />
                )
                    : dessert.title}
            </th>
            <td className="px-6 py-4">
                {editing ? (
                    <input
                        name="description"
                        placeholder={dessert.description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: `${Math.max(dessert.description.length + 2, 1)}ch` }}
                        className="input input-bordered input-sm w-full px-2 py-2" />
                )
                    : dessert.description}
            </td>
            <td className="px-6 py-4 font-bold">
                <div className="flex justify-between items-center">
                    {editing ? (
                        <input
                            name="rating"
                            placeholder={dessert.rating}
                            onChange={(e) => setRating(e.target.value)}
                            style={{ width: `6.5ch` }}
                            className="input input-bordered input-sm w-full" />
                    )
                        : dessert.rating}
                    <div className="space-x-2">
                        <button className="btn btn-primary" onClick={() => {
                            const _id = dessert._id
                            if (editing) {
                                editDessert({
                                    title,
                                    description,
                                    rating,
                                    _id,
                                }, props.token)
                                dessert.title = title ?? dessert.title
                                dessert.description = description ?? dessert.description
                                dessert.rating = rating ?? dessert.rating
                            }

                            setEditing(curr => !curr)

                        }}>  {editing ? "Save" : "Edit"} </button>
                        <button className="btn btn-error" onClick={() => {
                            const _id = dessert._id
                            deleteDessert({ _id }, props.token)
                            setVisible(false)
                        }}>Delete</button>
                    </div>
                </div>

            </td>
        </tr>
    ) : <></>
}