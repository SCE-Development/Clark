import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { queued, addUrl, pause, resume, skip, forward, rewind, setVolume } from '../../APIFunctions/Speaker';
import {debounce} from 'lodash';

function SpeakersPage(props) {

  const [url, setUrl] = useState('');
  const [playText, setPlayText] = useState('Play');
  const [playbuttonColor, setPlaybuttonColor] = useState('secondary');
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [error, setError] = useState();
  const [queue, setQueue] = useState([]);
  const [nextUpSong, setNextUpSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true); // Track playback state
  const [volume, setVolumeState] = useState(50); // Initial volume state

  const validateUrl = () => {
    setUrl(url.trim());
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const playSong = async () => {
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
  };

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
    <div>
      <div className='flex justify-center pt-10'>
        <div className="md:w-1/2">
          <div className='flex justify-center'>
            <input placeholder='Enter YouTube Link' onChange=
              {(e) => setUrl(e.target.value)}
            className="sign-input indent-2 w-full h-8 inline-block"
            >
            </input>
            {
              error && <p style={{ color: 'red', paddingTop: '7px' }}>{error}</p>
            }
            <button
              className="inline-block btn w-1/3"
              onClick={playSong}
              disabled={!url}
              color={playbuttonColor}
            >
              {playText}
            </button>
          </div>
          <div className="mt-6 mb-4 flex justify-center items-center">
            <button className="p-3 rounded-full focus:outline-none bg-gray-200 hover:bg-gray-500" onClick={handleRewind}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="size-4">
                <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
              </svg>
            </button>
            <button
              className="p-4 rounded-full bg-gray-200 hover:bg-gray-500 focus:outline-none mx-4"
              onClick={togglePlayback}
            >
              {isPlaying ? (
                // Pause icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                // Play icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button className="p-3 rounded-full focus:outline-none bg-gray-200 hover:bg-gray-500" onClick={handleForward}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="size-4">
                <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center items-center flex-col">
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
          <div className='mt-10 mb-20 items-center'>
            <table className="table-auto border-collapse w-full border-spacing-x-10 border-spacing-y-5">
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
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-cyan-950 text-white z-50">
            <div className="mt-2 ml-5 flex items-center">
              <button className="p-3 rounded-full focus:outline-none hover:bg-cyan-800" onClick={handleRewind}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-8">
                  <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
                </svg>
              </button>
              <button
                className="p-3 rounded-full focus:outline-none hover:bg-cyan-800 mx-4"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  // Pause icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-10">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  // Play icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-10">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button className="p-3 rounded-full focus:outline-none hover:bg-cyan-800" onClick={handleForward}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-8">
                  <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
                </svg>
              </button>
              <div className="flex items-center group ml-auto">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChangeCapture={(e) => setVolumeState(e.target.value)}
                  onChange={(e) => debouncedHandleVolumeChange(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="mr-10 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakersPage;
