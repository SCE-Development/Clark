import React from 'react';
import { useState } from 'react';
import { Input, Button, Container, Row, Col } from 'reactstrap';
import Header from '../../Components/Header/Header';
import { addUrl, pause, resume, skip } from '../../APIFunctions/Speaker';

function SpeakersPage(props) {

  const [url, setUrl] = useState('');

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
      </Container>
    </div>
  );
}

export default SpeakersPage;
