import React from 'react';
import { useState, useEffect } from 'react';
import { Spinner, Input, Button, Container, Row, Col } from 'reactstrap';
import Header from '../../Components/Header/Header';
import { addUrl, getQueued } from '../../APIFunctions/Speaker';

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
        setQueue(queued);
      });
  }, []);

  const handleSubmit = async () => {
    if (validateUrl()) {
      await addUrl(url, props.user, props.user.token);
    } else {
      alert('Invalid YouTube URL!');
    }
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
            <Button onClick={handleSubmit}>Submit</Button>
          </Col>
        </Row>
        <br></br>
        {queue.length > 0 ?
          queue.map(song => (
            <Row key={song._id}>
              <Col>
                <p>{song.url}</p>
              </Col>
              <Col>
                <p>Queued by {song.requestedBy}</p>
              </Col>
            </Row>
          ))
          :
          <p>Nothing Queued!</p>
        }
      </Container>
    </div>
  );
}

export default SpeakersPage;
