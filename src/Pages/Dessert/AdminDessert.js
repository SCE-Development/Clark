import React, { useState, useEffect } from 'react';
import { getAllDesserts, createDessert } from '../../APIFunctions/Dessert'
import AdminDessertItem from "../../Components/Desert/AdminDesertItem"
const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';
export default function DessertPage(props) {
    const [desserts, setDesserts] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [rating, setRating] = useState();
    async function getDessertsFromDB() {
        const dessertsFromDB = await getAllDesserts();

        if (!dessertsFromDB.error) {
            setDesserts(dessertsFromDB.responseData);
        }
    }
    useEffect(() => {
        if (refresh) {
            getDessertsFromDB();
            setRefresh(false);
        }
    }, [refresh]);


    return (
        <div className='m-10'>
            <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Admin Panel for Desserts!
            </h1>

            {/* form for making new desserts! */}
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-full sm:grid-cols-6">
                <div className="col-span-full sm:col-span-4">
                    <label htmlFor="title" className='block text-sm font-medium leading-6 text-gray-300'>
                        Dessert Title
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Cookies, Candy, KitKat, etc..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className={INPUT_CLASS}
                        />
                    </div>
                </div>
                <div className="col-span-full sm:col-span-4">
                    <label htmlFor="description" className='block text-sm font-medium leading-6 text-gray-300'>
                        Dessert Description
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={INPUT_CLASS}
                        />
                    </div>
                </div>
                <div className="col-span-full sm:col-span-4">
                    <label htmlFor="rating" className='block text-sm font-medium leading-6 text-gray-300'>
                        Rating (out of 10)
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="rating"
                            id="rating"
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                            className={INPUT_CLASS}
                        />
                    </div>
                </div>
                <div className="col-span-full sm:col-span-4">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => {
                            createDessert({ title, description, rating, }, props.user.token)
                            setRefresh(true)
                        }
                        }
                    >
                        Save
                    </button>
                </div>
            </div>


            <div className="relative overflow-x-auto mt-10">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Dessert name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Rating
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {desserts.map((dessert) => <AdminDessertItem key={dessert._id} dessert={dessert} token={props.user.token} />)}
                    </tbody>
                </table>
            </div>

        </div>
    );
}