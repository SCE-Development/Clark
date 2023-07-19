import React, { useEffect, useState } from 'react';

import Header from '../../Components/Header/Header';
import './URLShortener.css';
import { getAllUrls, createUrl, deleteUrl } from '../../APIFunctions/Cleezy';
import { Container, Button, Row, Col, Input } from 'reactstrap';
import { trashcanSymbol } from '../Overview/SVG';

export default function URLShortenerPage(props) {
  const [url, setUrl] = useState();
  const [invalidUrl, setInvalidUrl] = useState();
  const [alias, setAlias] = useState();
  const [allUrls, setAllUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [aliasTaken, setAliasTaken] = useState();
  const [createUrlResponse, setCreateUrlResponse] = useState({});

  async function getURLsFromDB() {
    const URLsFromDB = await getAllUrls(props.user.token);
    if (!URLsFromDB.error) {
      setAllUrls(URLsFromDB.responseData);
      setLoading(false);
    } else {
      setError(URLsFromDB.responseData);
    }
  }

  async function handleCreateUrl() {
    const response = await createUrl(url, alias, props.user.token);
    if (!response.error) {
      setCreateUrlResponse(response.responseData);
      setAllUrls([response.responseData, ...allUrls]);
      setAliasTaken(false);
      setUrl('');
      setAlias('');
      document.getElementById('url-box').value = '';
      document.getElementById('alias-box').value = '';
      return true;
    } else {
      setAliasTaken(true);
      return false;
    }
  }

  async function maybeSubmitUrl(url) {
    const regex =
      /^(http(s)?:\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.+~#?&//=]*)$/;
    if (regex.test(url)) {
      setInvalidUrl(false);
      handleCreateUrl();
    } else {
      setInvalidUrl(true);
      return false;
    }
  }

  async function handleDeleteUrl(alias) {
    const response = await deleteUrl(alias, props.user.token);
    if (!response.error) {
      setAllUrls(allUrls.filter(url => url.alias !== alias));
    }
  }

  useEffect(() => {
    getURLsFromDB();
  }, []);

  return (
    <div>
      <Header title="Welcome to the url Shortener!!" />
      <div className='body-container'>
        {error && <p> {String(error)} </p>}
        {!loading && !error && (
          <Container className='content-container'>
            <div>
              <h1>Create a new link</h1>
              <Row>
                <Col>
                  <input
                    type='text'
                    placeholder='Enter URL'
                    className='textbox'
                    id='url-box'
                    onChange={e => setUrl(e.target.value)} />
                  {invalidUrl && (
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
                    disabled={!url}
                    onClick={() => maybeSubmitUrl(url)}>
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
                  'Url',
                  'Alias',
                  'Link',
                  ''
                ].map((element, index) => {
                  return <th key={index}>{ element }</th>;
                })}
              </tr>
            </thead>

            <tbody>
              {allUrls.map((url, index) => {
                return (
                  <tr key= { index }>
                    <td>{  url.url }</td>
                    <td>{ url.alias}</td>
                    <td><a href = { url.link } target="_blank">{ url.link }</a></td>
                    <td>
                      <button
                        onClick={() => handleDeleteUrl(url.alias)}>
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
