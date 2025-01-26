import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { queued, addUrl, pause, resume, skip, forward, rewind, setVolume } from '../../APIFunctions/Speaker';
import {debounce} from 'lodash';
import { setFontAndSize } from 'pdf-lib';

// New import for SpeakerPlayBar
import SpeakerPlayBar from "./SpeakerPlayBar.js";

function SpeakersPage(props) {

  const [url, setUrl] = useState('');
  const [playText, setPlayText] = useState('Play');
  const [playbuttonColor, setPlaybuttonColor] = useState('bg-cyan-700');
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [error, setError] = useState();
  const [queue, setQueue] = useState([]);
  const [nextUpSong, setNextUpSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track playback state
  const [volume, setVolumeState] = useState(50); // Initial volume state

  // New hooks 
  const [songIn, setSongIn] = useState(false);
  const [q, setQ] = useState([]);
  const apiKey = "AIzaSyAMZxg8olNBCjPArzlRs_nlIG1gPdogjEs"

  // New function to extract video id form URL 
  const getVideoID = () => {
    const currentURL = new URL(url);
    return currentURL.searchParams.get('v');
  }

  // New function to retrieve video snippet from video id
  const getVideoSnippet = async (vidID) => {
    const searchURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vidID}&key=${apiKey}`;
    const response = await fetch(searchURL);
    const data = await response.json();
    return data.items[0].snippet; // snippet contains the vital info, return the object
  }

  // New function to retreive video content details from video id
  const getVideoContent = async (vidID) => {
    const searchURL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${vidID}&key=${apiKey}`
    const response = await fetch(searchURL);
    const data = await response.json();
    return data.items[0].contentDetails;
  }

  // New function to convert duration time from ISO to readable time
  function parseISO(duration) { 
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/; 
    const matches = duration.match(regex); 
    const hours = (matches[1] ? parseInt(matches[1].slice(0, -1)) : 0); const minutes = (matches[2] ? parseInt(matches[2].slice(0, -1)) : 0); 
    const seconds = (matches[3] ? parseInt(matches[3].slice(0, -1)) : 0); let formattedDuration = ""; 
    if (hours > 0) { 
      formattedDuration += `${hours}:`; } if (minutes > 0 || hours > 0) { formattedDuration += `${minutes}:`;
    } 
    if (seconds > 0 || (hours === 0 && minutes === 0)) { 
      formattedDuration += `${seconds}`; 
    } 
    return formattedDuration.trim(); 
  }

  const validateUrl = () => {
    setUrl(url.trim());
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const playSong = async () => {
    setIsPlaying(true);
    setSongIn(true);
    if (validateUrl()) {
      const vidID = getVideoID();
      console.log("Video ID:", vidID);
      try {
        const snippet = await getVideoSnippet(vidID);
        const contentDetails = await getVideoContent(vidID);
        console.log('Title:', snippet.title);
        console.log('Channel: ', snippet.channelTitle);
        console.log('Thumbnail URL:', snippet.thumbnails.default.url);
        const duration = parseISO(contentDetails.duration)
        console.log('Duration: ', duration);
  
        // Create an object to hold the snippet title and thumbnail URL
        const videoInfo = {
          title: snippet.title,
          thumbnailURL: snippet.thumbnails.default.url,
          channelTitle : snippet.channelTitle,
          duration,
        };
  
        // Add current video to q
        addSongToQueue(videoInfo);
      } catch (error) {
        console.error('Error fetching video info:', error);
        setError('Failed to fetch video information.');
      }
    } else {
      setError(`"${url}" is not a valid YouTube URL!`);
    }
  
    /*
    if (validateUrl()) {
      const result = await addUrl(url, props.user.token);
      if (result.error) {
        setError(String(result.responseData));
      } else {
        setPlaybuttonColor('success');
        setPlayText('Success!');
        setTimeout(() => {
          setPlayText('Play');
          setPlaybuttonColor('secondary');
        }, 1500);
      }
    } else {
      setError(`"${url}" is not a valid YouTube URL!`);
    }
      */
  };

  //New function to add a song to the q
  const addSongToQueue = (videoInfo) => {
    setQ(prevQ => {
      const newQ = [...prevQ, videoInfo];
      return newQ;
    });
  }

  //New function to log when q is updated
  useEffect(() => {
    console.log("Updated Queue: ", q);
  }, [q]);

  const updateDisplay = (queuedSongs) => {
    if (queuedSongs.length > 0) {
      setNextUpSong(queuedSongs[0]);
      setQueue(queuedSongs.slice(1));
    } else {
      setNextUpSong(null);
      setQueue([]);
    }
  };

  const getQueuedSongs = async () => {
    const songList = await queued(props.user.token);
    if (songList.error) {
      setError('Unable to reach speaker: ' + String(songList.responseData));
    }
    if (Array.isArray(songList.responseData)) {
      let q = songList.responseData;
      setQueuedSongs(q);
      updateDisplay(q);
    }
  };

  const modifySpeakerWrapper = async (modifier) => {
    const result = await modifier(props.user.token);
    if (result.error) {
      setError(String(result.responseData));
    }
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      await modifySpeakerWrapper(pause);
    } else {
      await modifySpeakerWrapper(resume);
    }
    setIsPlaying(!isPlaying);
  };

  const debouncedHandleVolumeChange = useCallback(
    debounce((value) => setVolume(value, props.user.token), 1000),
    []
  );

  const handleForward = async () => {
    await modifySpeakerWrapper(forward);
  };

  const handleRewind = async () => {
    await modifySpeakerWrapper(rewind);
  };

  useEffect(() => {
    getQueuedSongs();
  }, []);

  return (
    <div className="h-3/4 llborder-black llborder-solid llborder-4">
      {/**Main div containing search bar,  play/skip/rewind, next-up, position/name */}
      <div className='flex justify-center pt-10 h-full llborder-yellow-500 llborder-solid llborder-4'>
        <div className="w-3/4 flex flex-col llborder-green-500 llborder-solid llborder-4">
          <div className='llborder-pink-500 llborder-solid llborder-4'>
            {/** Div Containing Input and Play Button */}
            <div className="flex justify-center items-center gap-2 llborder-red-500 llborder-solid llborder-4">
              <input placeholder='Enter YouTube Link' onChange=
                {(e) => setUrl(e.target.value)}
              className="sign-input indent-2 w-full h-8 inline-block"
              >
              </input>
              {
                error && <p style={{ color: 'red', paddingTop: '7px' }}>{error}</p>
              }
              <button
                className={`text-white inline-block btn w-1/3 ${playbuttonColor} hover:bg-cyan-600 disabled:bg-cyan-800 disabled:text-gray-400`}
                onClick={playSong}
                disabled={!url}
                // color={playbuttonColor}
              >
                {playText}
              </button>
              <button onClick={() => setSongIn(false)}>Stop</button>
            </div>
            {/*Mini play bar */}
            <div className="mt-6 mb-4 flex justify-center items-center llborder-red-500 llborder-solid llborder-4">
              <button 
              className="p-3 rounded-full focus:outline-none bg-cyan-700 hover:bg-cyan-600  disabled:bg-cyan-800 disabled:text-gray-400" 
              onClick={handleRewind}
              disabled={!songIn}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`size-4 fill-current ${songIn ? 'text-white' : 'text-gray-400'}`}>
                  <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
                </svg>
              </button>
              <button
                className="p-4 rounded-full focus:outline-none mx-4  bg-cyan-700 hover:bg-cyan-600  disabled:bg-cyan-800 disabled:text-gray-400"
                onClick={togglePlayback}
                disabled={!songIn}
              >
                {isPlaying ? (
                  // Pause icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 fill-current ${songIn ? 'text-white' : 'text-gray-400'}`}>
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  // Play icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-6 h-6 fill-current ${songIn ? 'text-white' : 'text-gray-400'}`}>
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button className="p-3 rounded-full focus:outline-none bg-cyan-700 hover:bg-cyan-600  disabled:bg-cyan-800 disabled:text-gray-400" onClick={handleForward} disabled={!songIn}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`size-4 fill-current ${songIn ? 'text-white' : 'text-gray-400'}`}>
                  <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
                </svg>
              </button>
            </div>
          </div>
          {/**Next up Div */}
          {/**<div className="flex justify-center items-center flex-col llborder-red-500 llborder-solid llborder-4">
            <button className="p-3 rounded-full focus:outline-none hover:bg-gray-700 transition-colors duration-300" onClick={() => modifySpeakerWrapper(skip)}>
              <svg className="h-8 w-8 text-gray-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
            </button>
            <div><h2 className='text-center m-2 font-bold'>Next Up</h2></div>
            <div>
              {nextUpSong && (
                <div className='flex items-center flex-col'>
                  <img src={nextUpSong.thumbnail} alt={nextUpSong.title} className='w-3/4 h-3/4 m-4' />
                  <div>
                    <a href={nextUpSong.url} target="_blank" rel="noopener noreferrer" className='no-underline hover:underline'>
                      {nextUpSong.title}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          {<div className='mt-10 mb-20 items-center llborder-red-500 llborder-solid llborder-4'>
            <table className="table-auto llborder-collapse w-full llborder-spacing-x-10 llborder-spacing-y-5">
              <thead>
                <th>Position</th>
                <th className='text-left pl-2'>Name</th>
              </thead>
              <tbody>
                {
                  queue.map((song, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className='pl-2'><a href={song.url} className="no-underline hover:underline">{song.title}</a></td>
                      <img
                        src = {song.thumbnail}
                      />
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>}**/}
          {/**New Queue Bar */}
          {(q.length > 0) ? (
            <>
              <div className="rounded-lg bg-cyan-700 text-white font-semibold text-md w-fit p-2 mb-2">NOW PLAYING</div>
              <BigSongCard title={q[0].title} channelTitle={q[0].channelTitle} thumbnailURL={q[0].thumbnailURL} duration={q[0].duration} />
              <div className='flex flex-col items-center gap-2 llborder-purple-500 llborder-solid llborder-4'>
                {q.map((song, index) => (
                  <SongCard key={index} title={song.title} channelTitle={song.channelTitle} thumbnailURL={song.thumbnailURL} duration={song.duration} />
                ))}
              </div>
            </>
          ) : <></>}
          {/**Bottom div bar */}
          {songIn ?
          <SpeakerPlayBar isPlaying={isPlaying} handleForward={handleForward} handleRewind={handleRewind} togglePlayback={togglePlayback}/>: <></>}
        </div>
      </div>
    </div>
  );
}

const BigSongCard = ({ key, title, channelTitle, thumbnailURL, duration }) => {
  return(
     <div className="w-full flex items-center gap-4 pb-4 lborder-orange-500 lborder-4">
      <img src={thumbnailURL} alt ="video thumbnail" className="w-1/4 h-auto"/>
      <div className="flex flex-col gap-2 lborder-black lborder-4">
        <div className="text-2xl font-bold">{title}</div>
        <div>{channelTitle}</div>
      </div>
     </div>
  )
}

const SongCard = ({ key, title, channelTitle, thumbnailURL, duration}) => {
  //new component to represent a song 

  return (
  <div className="w-full flex rounded-md items-center justify-between bg-gray-100 px-6 llborder-blue-500 llborder-solid llborder-4">
    <img src={thumbnailURL} alt ="video thumbnail"/>
    <div className="w-1/2 overflow-hidden truncate whitespace-nowrap">{title}</div>
    {/*{<div>{channelTitle}</div>}*/}
    <div>{duration}</div>
  </div>)
}

export default SpeakersPage;
