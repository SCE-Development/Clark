import React from 'react';
import { useState, useEffect } from 'react';
import { Spinner, Input, Button, Container, Row, Col } from 'reactstrap';
import Header from '../../Components/Header/Header';
import { addUrl, getQueued, pause, resume, skip } from '../../APIFunctions/Speaker';

function SpeakersPage(props) {

  const [url, setUrl] = useState('');
  const [queue, setQueue] = useState([]);

  const validateUrl = () => {
    setUrl(url.trim());
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  useEffect(() => {
    getQueued()
      .then(queued => {
        console.debug(queued)
        setQueue(queued);
      });
  }, []);

  const playSong = async () => {
    if (validateUrl()) {
      await addUrl(url);
    } else {
      alert('Invalid YouTube URL!');
    }
  };
  const skipSong = async () => {
      await skip();
  };

  const pauseSong = async () => {
      await pause();
  };

  const resumeSong = async () => {
      await resume();
  };

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
        {queue.length > 0 ?  
          <Row >
            <p>{queue}</p>
          </Row>
          :
          <p>Nothing Queued!</p>
        }
      </Container>
    </div>
  );
}

export default SpeakersPage;
