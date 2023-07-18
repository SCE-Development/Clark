import React, { useEffect, useState } from 'react';

import Header from '../../Components/Header/Header';
import './URLShortener-page.css';
import { getAllURLs, createURL, deleteURL } from '../../APIFunctions/Cleezy';
import { Container, Button, Row, Col, Input } from 'reactstrap';
import { trashcanSymbol } from '../Overview/SVG';

export default function URLShortenerPage(props) {
  const [URL, setURL] = useState();
  const [invalidURL, setInvalidURL] = useState();
  const [alias, setAlias] = useState();
  const [allURLs, setAllURLs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [aliasTaken, setAliasTaken] = useState();
  const [createURLResponse, setCreateURLResponse] = useState({});

  async function getURLsFromDB() {
    const URLsFromDB = await getAllURLs(props.user.token);
    if (!URLsFromDB.error) {
      setAllURLs(URLsFromDB.responseData);
      setLoading(false);
    } else {
      setError(URLsFromDB.responseData);
    }
  }

  async function handleCreateURL() {
    const response = await createURL(URL, alias, props.user.token);
    console.debug(response);
    if (!response.error) {
      setCreateURLResponse(response.responseData);
      setAllURLs([response.responseData, ...allURLs]);
      setAliasTaken(false);
      setURL('');
      setAlias('');
      document.getElementById('url-box').value = '';
      document.getElementById('alias-box').value = '';
      return true;
    } else if(response.error === 409) {
      setAliasTaken(true);
      return false;
    } else {
      return false;
    }
  }

  async function checkValidURL(URL) {
    const regex =
      /^(http(s)?:\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.+~#?&//=]*)$/;
    if (regex.test(URL)) {
      setInvalidURL(false);
      handleCreateURL();
    } else {
      setInvalidURL(true);
      return false;
    }
  }

  async function handleDeleteURL(alias) {
    const response = await deleteURL(alias, props.user.token);
    if (!response.error) {
      setAllURLs(allURLs.filter(url => url.alias !== alias));
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
                    id='url-box'
                    onChange={e => setURL(e.target.value)} />
                  {invalidURL && (
                    <p className = 'invalid-text'>Please enter a valid URL</p>
                  )}
                </Col>
                <Col>
                  <input
                    type='text'
                    placeholder='Enter alias'
                    className='textbox'
                    id='alias-box'
                    onChange={e => setAlias(e.target.value)} />
                  {aliasTaken && (
                    <p className = 'invalid-text'>Alias already in use</p>
                  )}
                </Col>
              </Row>
            </div>
            <div>
              <Row style={{marginTop: '1rem '}}>
                <Col>
                  <Button
                    className='submit-button'
                    disabled={!URL}
                    onClick={() => checkValidURL(URL)}>
                      Submit
                  </Button>
                </Col>
              </Row>
            </div>
          </Container>
        )}
        <div className='map-urls'>
          <h1>List of URLs:</h1>
          <table className = 'url-table'>
            <thead className = 'url-table-header'>
              <tr>
                {[
                  'URL',
                  'Alias',
                  'Link',
                  ''
                ].map((element, index) => {
                  return <th key={index}>{ element }</th>;
                })}
              </tr>
            </thead>

            <tbody>
              {allURLs.map((URL, index) => {
                return (
                  <tr key= { index }>
                    <td>{  URL.url }</td>
                    <td>{ URL.alias}</td>
                    <td><a href = { URL.link } target="_blank">{ URL.link }</a></td>
                    <td>
                      <button
                        onClick={() => handleDeleteURL(URL.alias)}>
                        {trashcanSymbol()}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
