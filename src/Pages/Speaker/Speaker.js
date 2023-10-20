import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Button, Container, Row, Col } from 'reactstrap';
import Header from '../../Components/Header/Header';
import { queued, addUrl, pause, resume, skip } from '../../APIFunctions/Speaker';
import './speaker.css';

function SpeakersPage(props) {

  const [url, setUrl] = useState('');
  const [playText, setPlayText] = useState('Play');
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
        // this means 
        setPlayText('Success!');
        setTimeout(() => {
          setPlayText('Play');
        }, 1500)
      }
    } else {
      setError(`"${url}" is not a valid YouTube URL!`);
    }
  };

  const getQueuedSongs = async () => {
    const songList = await queued(props.user.token);
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
      <Container>
        <div className="speaker-page-wrapper">
          <Row>
            <Col>
              <Input placeholder='Enter YouTube Link' onChange=
                {(e) => setUrl(e.target.value)}
                className="sign-input"
                style={{ width: '100%', height: '2rem' }}
              >
              </Input>
            </Col>
            {
              error && <p style={{ color: 'red', paddingTop: '7px' }}>{error}</p>
            }
          </Row>
          <Col>
            <Row>
              <Col>
                <Button className="sign-input" onClick={() => modifySpeakerWrapper(pause)}>Puase</Button>
              </Col>
              <Col>
                <Button className="sign-input" onClick={() => modifySpeakerWrapper(resume)}>Resume</Button>
              </Col>
              <Col>
                <Button className="sign-input" onClick={playSong} disabled={!url}>
                  {playText}
                </Button>
              </Col>
              <Row>
                <Button onClick={() => modifySpeakerWrapper(skip)} className="sign-input"
                  style={{
                    marginTop: '0.5rem',
                    background: 'red',
                    borderColor: 'red',
                    marginLeft: '0.75rem',
                    height: '5rem',
                    fontWeight: '900',
                    fontSize: '40px'
                  }}>Skip</Button>
              </Row>
              <div style={{ marginTop: '5rem', alignItems: 'center' }}>
                <h2 style={{ textAlign: 'center' }}>Queued</h2>
                <table>
                  <thead>
                    <th>Position</th>
                    <th style={{ textAlign: 'left', paddingLeft: '2rem' }}>Name</th>
                  </thead>
                  <tbody>
                    {
                      queuedSongs.map((song, index) => (
                        <tr key={index}>
                          <td>{index}</td>
                          <td style={{ paddingLeft: '2rem' }}><a href={song}>{song}</a></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </Row>
          </Col>
        </div>
      </Container>
    </div>
  );
}

export default SpeakersPage;
