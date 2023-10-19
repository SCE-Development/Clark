import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Button, Container, Row, Col } from 'reactstrap';
import Header from '../../Components/Header/Header';
import { queued, addUrl, pause, resume, skip } from '../../APIFunctions/Speaker';
import './speaker.css';

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
      <Container>
        <div className="wrapper">
          <Row>
            <Col>
              <Input placeholder='Enter YouTube Link' onChange=
                {(e) => setUrl(e.target.value)}
                className="sign-input"
                style={{width : "100%", height : "2rem"}}
                >
                </Input>
            </Col>
          </Row>
          <Col>
              <Row>
                <Col>
                  <Button className="sign-input" onClick={pauseSong}>Puase</Button>
                </Col>
                <Col>
                  <Button className="sign-input" onClick={resumeSong}>Resume</Button>
                </Col>
                <Col>
                  <Button className="sign-input" onClick={playSong}>Play</Button>
                </Col>
                <Row>
                  <Button onClick={skipSong} className="sign-input" 
                  style={{marginTop : "0.5rem", 
                  background : "red",
                  borderColor : "red",
                  marginLeft : "0.75rem",
                  height : '5rem',
                  fontWeight : '900',
                  fontSize : '40px'
                  }}>Skip</Button>
                </Row>
                <div style={{marginTop : "5rem", alignItems : 'center'}}>
                  <h2 style={{textAlign : 'center'}}>Queued</h2> 
                  <table>
                    <thead>
                      <th>Position</th>
                      <th style={{textAlign : "left", paddingLeft : '2rem'}}>Name</th>
                    </thead>
                    <tbody>
                      {
                        queuedSongs.map((song,index) => (
                        <tr key={index}>
                          <td>{index}</td>
                          <td style={{paddingLeft : '2rem'}}><a href={song}>{song}</a></td>
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
