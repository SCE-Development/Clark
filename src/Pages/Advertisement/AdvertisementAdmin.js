import React from 'react';
import { createAd, getAds, deleteAd } from '../../APIFunctions/Advertisement.js';
import { useState, useEffect } from 'react';
import { useSCE } from '../../Components/context/SceContext.js';

export default function AdvertisementAdmin() {
  const { user } = useSCE();

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

  function isExpired() {
    if (!expireDate) {
      return false;
    }
    const currDate = new Date();
    const expireDateObject = new Date(expireDate);
    return expireDateObject < currDate;
  }

  async function createAdHandler() {
    const newAd = { message };
    if (expireDate) {
      const asDateObject = new Date(expireDate);
      newAd.expireDate = asDateObject.toISOString();
    }
    // expireDate is a string so we need to turn into date object
    await createAd(newAd, user.token);

    await getAdsFromDB();
  }

  function maybeRenderExpirationInput() {
    if (!message) {
      return null;
    }
    if (!expireButtonClicked) {
      return (
        <>
          <button
            className="text-sm btn light:btn-gray dark:btn-neutral sm:text-base"
            onClick={() => setExpiredButtonClicked(true)}
          >
            Set Expiration Date For Ad
          </button>
        </>
      );
    }
    return (
      <>
        <input
          className='text-sm input input-bordered sm:text-base'
          type='datetime-local'
          onChange={event => {
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
          Remove Expiration
        </button>
      </>
    );
  }

  function getFormattedTime(maybeISOString = null) {
    let date = new Date();
    if (maybeISOString) {
      date = new Date(maybeISOString);
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  }

  function maybeRenderCreateAdInputs() {
    if (!message) {
      return;
    }
    return (
      <>
        {message && <div>
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text text-md">
                Optional: Type an expiration date for your ad. Time is in your local timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone}).
              </span>
            </div>
          </label>
        </div>}
        <div className="flex gap-2 mb-3">
          {maybeRenderExpirationInput()}
          <button
            className="text-sm btn btn-primary sm:text-base"
            onClick={() => {
              createAdHandler();
            }}
          >
            Create Ad
          </button>
        </div>
        {
          isExpired() && <div>

            <label className="w-full form-control mb-3">
              <div className="label flex flex-col items-start space-y-1">
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  Your selected expiration is considered behind the current time of {getFormattedTime()}.
                </span>
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  Submitting an ad with this expiration will not save the ad in the database.
                </span>
              </div>
            </label>
          </div>
        }
      </>
    );
  }

  useEffect(() => {
    getAdsFromDB();
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
              placeholder="Create a new ad here! (255 char max)"
              maxlength="255"
              onChange={event => {
                setMessage(event.target.value);
              }}
            />
          </label>
        </div>
        {maybeRenderCreateAdInputs()}
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
                    {ad.expireAt ? getFormattedTime(ad.expireAt) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-sm btn btn-primary sm:text-base"
                      onClick={async () => {
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
