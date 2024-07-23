import React from 'react';
import { useState, useEffect } from 'react';
import { queued, addUrl, pause, resume, skip } from '../../APIFunctions/Speaker';


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

  const handleVolumeChange = async (volume) => {
    setVolumeState(volume); // Update local volume state
    const result = await setVolume(volume, props.user.token);
    // console.log('Volume set to: ' + volume);
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
          <div className="flex items-center w-full py-4">
            <button
              className="btn w-1/3 bg-gray-500 text-white hover:bg-black-600 mr-2"
              onClick={togglePlayback}>
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
            <button onClick={() => modifySpeakerWrapper(skip)} className="btn w-1/3 bg-gray-500 hover:bg-black-600 text-white mr-2">
              Skip
            </button>
            <div className="flex items-center w-1/3">
              <span className="mr-2">Volume</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <div><h2 className='text-center m-2'>Next Up</h2></div>
            <div>
              {nextUpSong && (
                <div className='flex items-center flex-col'>
                  <img src={nextUpSong.thumbnail} alt={nextUpSong.title} className='w-3/4 h-3/4 m-4' />
                  <div>
                    <a href={nextUpSong.url} target="_blank" rel="noopener noreferrer">
                      {nextUpSong.title}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='mt-10 items-center'>
            <h2 className='text-center' >Queued</h2>
            <table className="table-auto border-collapse w-full border-separate border-spacing-x-10 border-spacing-y-5">
              <thead>
                <th>Position</th>
                <th className='text-left pl-2'>Name</th>
              </thead>
              <tbody>
                {
                  queue.map((song, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className='pl-2'><a href={song.url}>{song.title}</a></td>
                      <img
                        src = {song.thumbnail}
                      />
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakersPage;
