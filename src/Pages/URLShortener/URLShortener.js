import React, { useEffect, useState } from 'react';

import Header from '../../Components/Header/Header';
import './URLShortener-page.css';
import { getAllURLs, createURL, deleteURL } from '../../APIFunctions/URLShortener';
import { Container, Button, Row, Col, Input } from 'reactstrap';

export default function URLShortenerPage(props) {
  const [URL, setURL] = useState();
  const [alias, setAlias] = useState();
  const [allURLs, setAllURLs] = useState([]);
  const [deleteAlias, setDeleteAlias] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  async function getURLsFromDB() {
    const URLsFromDB = await getAllURLs(props.user.token);
    if (!URLsFromDB.error) {
      setAllURLs(URLsFromDB.responseData);
      setLoading(false);
    } else {
      setError(URLsFromDB.responseData);
    }
  }

  useEffect(() => {
    getURLsFromDB();
  }, []);

  return (
    <div>
      <Header title="Welcome to the URL Shortener!!" />
      <div className='body-container'>
        {error && <p> {String(error)} </p>}
        {!loading && !error && (
          <Container className='content-container'>
            <div>
              <h1>Create a new URL</h1>
              <Row>
                <Col>
                  <input
                    type='text'
                    placeholder='Enter URL'
                    className='textbox'
                    onChange={e => setURL(e.target.value)} />
                </Col>
                <Col>
                  <input
                    type='text'
                    className='textbox'
                    placeholder='Enter alias'
                    onChange={e => setAlias(e.target.value)} />
                </Col>
              </Row>
            </div>
            <div>
              <Row style={{marginTop: '1rem '}}>
                <Col>
                  <Button
                    className='submit-button'
                    disabled={!URL}
                    onClick={() => createURL(URL, alias, props.user.token)}>
                      Submit
                  </Button>
                </Col>
              </Row>
            </div>
            <div>
              <h1>Delete a URL</h1>
              <Row>
                <Col>
                  <input
                    type='text'
                    className='textbox'
                    placeholder='Enter alias to delete'
                    onChange={e => setDeleteAlias(e.target.value)}/>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    className='submit-button'
                    disabled={!deleteAlias}
                    onClick={() => deleteURL(deleteAlias, props.user.token)}>
                      Delete URL
                  </Button>
                </Col>
              </Row>
            </div>
          </Container>
        )}
        <div className='map-urls'>
          <h1>List of URLs:</h1>
          {allURLs.map((URL, index) => (
            <div key={index}>
              <h2>{index}</h2>
              <p>{URL.url} saved with alias: {URL.alias}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
