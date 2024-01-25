import React from 'react';
import { useState, useEffect } from 'react';
import { queued, addUrl, pause, resume, skip } from '../../APIFunctions/Speaker';


function SpeakersPage(props) {

  const [url, setUrl] = useState('');
  const [playText, setPlayText] = useState('Play');
  const [playbuttonColor, setPlaybuttonColor] = useState('secondary');
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [error, setError] = useState();

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

  const getQueuedSongs = async () => {
    const songList = await queued(props.user.token);
    if (songList.error) {
      setError('Unable to reach speaker: ' + String(songList.responseData));
    }
    if (Array.isArray(songList.responseData)) {
      setQueuedSongs(songList.responseData);
    }
  };


  const modifySpeakerWrapper = async (modifier) => {
    const result = await modifier(props.user.token);
    if (result.error) {
      setError(String(result.responseData));
    }
  };

  useEffect(() => {
    getQueuedSongs();
  }, []);

  return (
    <div>
      <div className='flex justify-center pt-10'>
        <div className="md:w-1/2">
          <input placeholder='Enter YouTube Link' onChange=
            {(e) => setUrl(e.target.value)}
          className="sign-input indent-2 w-full h-8"
          >
          </input>
          {
            error && <p style={{ color: 'red', paddingTop: '7px' }}>{error}</p>
          }
          <div className='w-full py-4'>
            <button
              className="btn w-1/3"
              onClick={() => modifySpeakerWrapper(pause)}>
                Pause
            </button>
            <button
              className="btn w-1/3"
              onClick={() => modifySpeakerWrapper(resume)}>
                Resume
            </button>
            <button
              className="btn w-1/3"
              onClick={playSong}
              disabled={!url}
              color={playbuttonColor}
            >
              {playText}
            </button>
          </div>
          <button onClick={() => modifySpeakerWrapper(skip)} className="btn w-full bg-red-600 hover:bg-red-700 text-white text-3xl">
                Skip
          </button>
          <div className='mt-20 items-center'>
            <h2 className='text-center' >Queued</h2>
            <table>
              <thead>
                <th>Position</th>
                <th className='text-left pl-2'>Name</th>
              </thead>
              <tbody>
                {
                  queuedSongs.map((song, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td className='pl-8'><a href={song}>{song}</a></td>
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
