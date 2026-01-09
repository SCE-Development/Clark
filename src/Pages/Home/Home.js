import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import Footer from '../../Components/Footer/Footer.js';
import { getAd } from '../../APIFunctions/Advertisement.js';
import { getHomeImage } from '../../APIFunctions/Image.js';
import { incrementVisitCount, getVisitCount } from '../../APIFunctions/HomepageVisit.js';
import './Home.css';

<<<<<<< HEAD
const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/thebeninator/Clark/refs/heads/add_comp_homepage/public/images/compressed2.jpg';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({
    message: '',
    imageUrl: DEFAULT_IMAGE,
    imageAlt: 'SCE Club Image',
    visitCount: 0,
  });
=======
import { getAd } from '../../APIFunctions/Advertisement.js';
import { incrementVisitCount, getVisitCount } from '../../APIFunctions/Visit.js';

const Home = () => {

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showAll, setShowAll] = useState(false);
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

  async function loadVisitCounter() {
    const type = 'HOME_PAGE';
    await incrementVisitCount(type);
    const response = await getVisitCount(type);
    if(!response.error) setVisitCount(response.responseData.visitCount);
  }
>>>>>>> f8152759 (visit count api includes page type; tracks dev mode visits)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adRes, imgRes, _] = await Promise.all([
          getAd(),
          getHomeImage(),
          incrementVisitCount(),
        ]);

        const visitRes = await getVisitCount();

        setData({
          message: adRes.responseData?.message || '',
          imageUrl: imgRes.error ? DEFAULT_IMAGE : imgRes.responseData.url,
          imageAlt: imgRes.error ? 'SCE Club Image' : imgRes.responseData.alt,
          visitCount: visitRes.responseData?.visitCount || 0,
        });
      } catch (err) {
        console.error("Home Page failed to load full data", err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  const renderedMessage = useMemo(() => {
    if (!data.message) return null;

    return data.message.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
      const isUrl = /https?:\/\/[^\s]+/.test(part);
      if (isUrl) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener" className="text-blue-400 underline hover:text-blue-200 transition-colors">
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }, [data.message]);

  // only include values passed in that evaluate to true
  const getClassName = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div className="flex flex-col min-h-[calc(100vh-86px)] bg-gradient-to-r from-gray-800 to-gray-600 overflow-x-hidden">
      <main className="flex flex-col md:flex-row items-center justify-center flex-1 py-8 container mx-auto">
        
        <section className="flex flex-col items-center xl:items-start w-full p-6 xl:w-2/5">
          <div className={getClassName("transition-all duration-700 transform", isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0")}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center xl:text-left mb-4 leading-tight">
              Software and Computer <br /> Engineering Society
            </h1>
            <h3 className="text-xl md:text-2xl text-gray-400 text-center xl:text-left mb-8">
              SJSU's Largest Engineering Club
            </h3>
          </div>

          <div className={getClassName("flex space-x-4 transition-all delay-300 duration-700", isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0")}>
            <Link to="/about" className="btn btn-outline text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white px-8">
              Learn More
            </Link>
            <Link to="/register" className="btn bg-blue-500 border-none text-white hover:bg-blue-600 px-8">
              Join Us!
            </Link>
          </div>
        </section>

        <section className={getClassName("relative w-full p-6 xl:w-3/5 transition-opacity duration-1000", isLoaded ? "opacity-100" : "opacity-0")}>
          <div className="relative group">
            <img
              className="w-full aspect-video object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              src={data.imageUrl}
              alt={data.imageAlt}
            />
            
            {data.message && (
              <div className="absolute -top-6 -right-2 md:-right-6 z-10 animate-bounce">
                <div className="minecraft-styling bg-black/50 p-2 rounded text-yellow-400 drop-shadow-lg transform rotate-[-12deg] text-sm md:text-xl">
                  {renderedMessage}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="text-gray-500 text-right p-6 text-sm">
        Global Visits: <span className="font-mono">{data.visitCount.toLocaleString()}</span>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
