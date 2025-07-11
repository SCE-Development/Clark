import React from 'react';
import { createAd, getAds, deleteAd } from '../../APIFunctions/Advertisement.js';
import { useState, useEffect } from 'react';
import { useSCE } from '../../Components/context/SceContext.js';

export default function AdvertisementAdmin() {
  const { user } = useSCE();

  const [errorMesssage, setErrorMessage] = useState('');
  const [ads, setAds] = useState([]);
  const [message, setMessage] = useState('');
  const [expireDate, setExpireDate] = useState();
  const [expireButtonClicked, setExpiredButtonClicked] = useState(false);

  async function getAdsFromDB() {
    const adsFromDB = await getAds(user.token);
    if (!adsFromDB.error) {
      setAds(adsFromDB.responseData);
    }
  }

  function isExpired(expireDate){
    const currDate = new Date();
    const expireDateObject = new Date(expireDate);
    return expireDateObject < currDate;
  }

  async function createAdHandler() {
    if(expireDate === null){
      setExpireDate(undefined);
    }
    // expireDate is a string so we need to turn into date object
    if(isExpired(expireDate)){
      setErrorMessage('Setting an expiration date in the past will not properly save an ad to database!!');
    }else{
      setErrorMessage('');
    }
    await createAd({
      message,
      expireDate,
    }, user.token);

    await getAdsFromDB();

  }

  useEffect(() => {
    getAdsFromDB();
  }, []);

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Welcome to the Advertisement Admin Page!!
      </h1>
      <h2 style={{fontWeight: 'bold', color: 'red'}} >{errorMesssage}</h2>
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
          {expireButtonClicked ? (
            <>
              {/* ^^ fragment wrapping */}
              <input
                className='flex-1 text-sm input input-bordered sm:text-base'
                type='datetime-local'
                onChange={ event => {
                  setExpireDate(event.target.value);
                }}
              />
              <button
                className="text-sm btn btn-error sm:text-base"
                onClick={() => {
                  setExpiredButtonClicked(false);
                  setExpireDate(undefined); // so that if the user decides to cancel after inputting a date, it will be N/A not prev input
                }}
              >
              Cancel
              </button>
            </>
          ) : (
            <button
              className="text-sm btn btn-primary sm:text-base"
              onClick={() => setExpiredButtonClicked(true)}
            >
              Set Expiration Date For Ad
            </button>
          )}

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
                Expiration Date
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
                        await deleteAd(ad, user.token);
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
