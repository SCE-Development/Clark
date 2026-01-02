import React, { useEffect, useState} from 'react';
import Footer from '../../Components/Footer/Footer.js';
import './Home.css';

import { getAd } from '../../APIFunctions/Advertisement.js';
import { getHomeImage } from '../../APIFunctions/Image.js';
import { incrementVisitCount, getVisitCount } from '../../APIFunctions/HomepageVisit.js';
const Home = () => {

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [homeImageUrl, setHomeImageUrl] = useState('');
  const [homeImageAlt, setHomeImageAlt] = useState('');
  const [visitCount, setVisitCount] = useState(0);

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

  async function loadHomeImage() {
    const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/thebeninator/Clark/refs/heads/add_comp_homepage/public/images/compressed2.jpg';
    const response = await getHomeImage();
    let url = DEFAULT_IMAGE;
    let alt = 'sce club image';
    if (!response.error) {
      url = response.responseData.url;
      alt = response.responseData.alt;
    }
    setHomeImageUrl(url);
    setHomeImageAlt(alt);
  }

  async function loadVisitCounter() {
    await incrementVisitCount();
    const response = await getVisitCount();
    if(!response.error) setVisitCount(response.responseData.visitCount);
  }

  useEffect(() => {
    getMessage();
    loadHomeImage();
    loadVisitCounter();
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
            className="text-blue-400 underline hover-grow"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-86px)] z-[-200] bg-gradient-to-r from-gray-800 to-gray-600">
      <div className="flex flex-col flex-wrap items-center justify-center flex-1 h-full py-4 md:flex-row xl:my-0">
        <div className="flex flex-col items-center justify-center w-full p-4 overflow-y-hidden xl:w-2/5">
          <div className="flex flex-col mb-8 xl:ml-10">
            <h1
              className={`slide-in-top hover-grow my-4 text-3xl font-bold text-center text-white opacity-75 md:text-5xl xl:text-left${showAll ? ' show' : ''}`}>
              The Software and Computer Engineering Society
            </h1>

            <h3
              className={`slide-in-right hover-grow text-base text-gray-400 text-center xl:text-left md:text-2xl${showAll ? ' show' : ''}`}>
              SJSU's Largest Engineering Club
            </h3>
          </div>

          <div className={`slide-in-bottom flex justify-center space-x-3${showAll ? ' show' : ''}`}>
            <a href="/about" rel="nofollow noreferrer" target="_blank">
              <button className="btn btn-outline text-lg text-blue-400 hover:bg-blue-700 hover:!text-white hover-grow">
                Learn More
              </button>
            </a>

            <a href="/register">
              <button className="btn btn-outline text-lg btn-accent hover:!text-white hover-grow">
                Join Us!
              </button>
            </a>
          </div>
        </div>


        <div className={`fade-in-img w-full h-full p-6 md:p-12 overflow-visible xl:w-3/5${showAll ? ' show' : ''}`}>
          <div className="relative max-w-max mx-auto">
            <img
            className="w-full mx-auto transform md:w-4/5 rounded-xl"
            src={homeImageUrl}
            alt={homeImageAlt}
          />
            <div className={`absolute -top-2 -right-2 md:right-10 md:top-0 z-10 fade-scale-in${showMessage ? ' show' : ''}`}>
              <div className="minecraft-styling text-yellow-400 drop-shadow-lg transform rotate-[-20deg] text-sm md:text-xl whitespace-nowrap">
                {renderMessageWithLinks(message)}
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className={`slide-in-right pr-6 pb-6 text-base text-gray-400 text-right ${showAll ? ' show' : ''}`}>
          Visit Count: {visitCount}
        </div>
      <Footer />
    </div>
  );
};

export default Home;
