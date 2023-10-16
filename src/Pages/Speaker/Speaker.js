import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Button, Container, Row, Col } from 'reactstrap';
import Header from '../../Components/Header/Header';
import { queued, addUrl, pause, resume, skip } from '../../APIFunctions/Speaker';

function SpeakersPage(props) {

  const [url, setUrl] = useState('');
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [error, setError] = useState();

  const validateUrl = () => {
    setUrl(url.trim());
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const playSong = async () => {
    if (validateUrl()) {
      await addUrl(url, props.user.token);
    } else {
      alert('Invalid YouTube URL!');
    }
  };

  const getQueuedSongs = async () => {
    try {
      const songList = await queued(props.user.token);
      if (Array.isArray(songList.responseData)) {
        setQueuedSongs(songList.responseData);
      } else {
        console.debug('Invalid response from queued:', songList);
      }
    } catch (error) {
      console.debug('Error fetching queued songs:', error);
    }
  };


  const skipSong = async () => {
    await skip(props.user.token);
  };

  const pauseSong = async () => {
    await pause(props.user.token);
  };

  const resumeSong = async () => {
    await resume(props.user.token);
  };

  useEffect(() => {
    getQueuedSongs();
  }, []);

  return (
    <div>
      <Header title="SCE Room Speakers" />
      <Container>
        <p></p>
        <Row>
          <Col>
            <Input placeholder='Enter YouTube Link' onChange=
              {(e) => setUrl(e.target.value)}></Input>
          </Col>
          <Col>
            <Button onClick={playSong}>Play</Button>
          </Col>
        </Row>
        <Col>
          <Button onClick={skipSong}>Skip</Button>
          <Button style={{marginLeft : '1rem'}} onClick={pauseSong}>Puase</Button>
          <Button style={{marginLeft : '1rem'}} onClick={resumeSong}>Resume</Button>
        </Col>
        <br></br>
      </Container>
      <div>Queued: {queuedSongs.map(song => <div key={song}>{song}</div>)}</div>
    </div>
  );
}

export default SpeakersPage;
