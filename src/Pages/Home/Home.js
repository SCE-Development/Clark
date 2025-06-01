import React, { useEffect, useState} from 'react';
import Footer from '../../Components/Footer/Footer.js';
import './Home.css';

import { getAd } from '../../APIFunctions/Advertisement.js';

const Home = () => {

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showAll, setShowAll] = useState(false);
  async function getMessage() {
    try {
      const messageData = await getAd();
      const adsList = messageData.responseData;
      setMessage(adsList['message']);
      setShowMessage(true);
    } catch {
      setMessage('');
    }
  }

  useEffect(() => {
    getMessage();
    setTimeout(() => setShowAll(true), 100);
  }, []);

  function isValidUrl(str) {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  }

  function renderMessageWithLinks(message) {
    if (!message) {
      return null;
    }
    return message.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
      if (isValidUrl(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {part}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  }

  return (
    <div className='flex flex-col min-h-[calc(100vh-86px)] z-[-200] bg-gradient-to-r from-gray-800 to-gray-600'>
      <div className = "flex flex-col items-center justify-center my-4">
        <p className={`fade-scale-in text-white${showMessage ? ' show' : ''}`}>
          {message}
        </p>
      </div>
      <div className="flex flex-col flex-wrap items-center justify-center flex-1 h-full my-4 md:flex-row xl:my-0">
        <div className="flex flex-col items-center justify-center w-full p-4 overflow-y-hidden xl:w-2/5">
          <div className="flex flex-col mb-8 xl:ml-10">
            <h1
              className={`slide-in-top my-4 text-3xl font-bold text-center text-white opacity-75 md:text-5xl xl:text-left${showAll ? ' show' : ''}`}>
              The Software and Computer Engineering Society
            </h1>
            <h3
              className={`slide-in-right text-base text-gray-400 text-center xl:text-left md:text-2xl${showAll ? ' show' : ''}`}>
              SJSU's Largest Engineering Club
            </h3>
          </div>
          <div
            className={`slide-in-bottom flex justify-center space-x-3 slide-in-bottom${showAll ? ' show' : ''}`}>
            <a href="/about" rel="nofollow noreferrer" target="_blank">
              <button className="btn btn-outline text-lg text-blue-400 hover:bg-blue-700 hover:!text-white">Learn More</button>
            </a>
            <a href="/register">
              <button className="btn btn-outline text-lg btn-accent hover:!text-white">Join Us!</button>
            </a>
          </div>
        </div>


        <div className={`fade-in-img w-full h-full p-12 overflow-hidden xl:w-3/5${showAll ? ' show' : ''}`}>
          <img
            className="w-full mx-auto transform md:w-4/5 rounded-xl"
            src="https://github.com/SCE-Development/Clark/assets/116464215/1a763961-5f7e-4ddc-9298-139b25c54a08"
          />
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Home;
