import React from 'react';
import { createAd, getAds, deleteAd } from '../../APIFunctions/Advertisement.js';
import { useState, useEffect } from 'react';

export default function AdvertisementAdmin(props) {

  const [ads, setAds] = useState([]);
  const [message, setMessage] = useState('');
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();

  async function getAdsFromDB() {
    const adsFromDB = await getAds(props.user.token);
    if (!adsFromDB.error) {
      setAds(adsFromDB.responseData);
    }
  }

  async function createAdHandler() {
    // make sure empty inputs are properly set as undefined if empty
    if (year === '') {
      setYear(undefined);
    }
    if (month === '') {
      setMonth(undefined);
    }
    if (day === '') {
      setDay(undefined);
    }

    let expireDate = new Date(year, month - 1, day);
    if (isNaN(expireDate.getTime())) {
      expireDate = undefined;
    }

    await createAd({
      message,
      expireDate,
    }, props.user.token);

    await getAdsFromDB();
  }

  async function deleteExpiredAds() {
    const adsFromDB = await getAds(props.user.token);
    if (!adsFromDB.error) {
      const currentDate = new Date();
      const expiredAds = adsFromDB.responseData.filter(ad => {
        if (ad.expireDate === undefined) return false;
        return new Date(ad.expireDate) < currentDate;
      });

      for (const ad of expiredAds) {
        await deleteAd(ad, props.user.token);
      }
    }
  }

  useEffect(() => {
    getAdsFromDB();

    const intervalId = setInterval(async () => {
      await deleteExpiredAds();
      await getAdsFromDB();
    }, 20);

  }, []);

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Welcome to the Advertisement Admin Page!!
      </h1>
      <div className="relative overflow-x-auto">
        <div className='py-6'>
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text text-md">Type an advertisement message to add to home page</span>
            </div>
            <input
              className="w-full text-sm input input-bordered sm:text-base"
              type="text"
              placeholder="Type at most 255 characters"
              maxlength="255"
              onChange={event => {
                setMessage(event.target.value);
              }}
            />
          </label>
        </div>
        <div>
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text text-md">
                Optional: Type an expiration date for your ad. All inputs should be typed in numbers. ex. 2024-9-13
              </span>
            </div>
          </label>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          <input
            className="flex-1 text-sm input input-bordered sm:text-base"
            type="text"
            placeholder="Year"
            onChange={event => {
              setYear(event.target.value);
            }}
          />
          <input
            className="flex-1 text-sm input input-bordered sm:text-base"
            type="text"
            placeholder="Month"
            onChange={event => {
              setMonth(event.target.value);
            }}
          />
          <input
            className="flex-1 text-sm input input-bordered sm:text-base"
            type="text"
            placeholder="Day"
            onChange={event => {
              setDay(event.target.value);
            }}
          />
          <button
            className="text-sm btn btn-primary sm:text-base"
            onClick = {() => {
              createAdHandler();
            }}
          >
            Create Ad
          </button>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Advertisement Message
              </th>
              <th scope="col" className="px-6 py-3">
                Expiriation Date
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => {
              return (
                <tr key={ad._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {ad.message}
                  </th>
                  <td className="px-6 py-4">
                    {ad.expireDate === undefined ? 'N/A' : ad.expireDate}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-sm btn btn-primary sm:text-base"
                      onClick = {async () => {
                        await deleteAd(ad, props.user.token);
                        await getAdsFromDB();
                      }}
                    >
                      Delete Ad
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
