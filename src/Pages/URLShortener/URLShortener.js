import React, { useEffect, useState } from 'react';

import Header from '../../Components/Header/Header';
import './URLShortener.css';
import { getAllUrls, createUrl, deleteUrl } from '../../APIFunctions/Cleezy';
import { Container, Button, Row, Col, Input } from 'reactstrap';
import { trashcanSymbol } from '../Overview/SVG';

export default function URLShortenerPage(props) {
  const [isCleezyDisabled, setIsCleezyDisabled] = useState(false);
  const [url, setUrl] = useState();
  const [invalidUrl, setInvalidUrl] = useState();
  const [alias, setAlias] = useState();
  const [allUrls, setAllUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [aliasTaken, setAliasTaken] = useState();

  /**
   * Cleezy page is disabled by default since you have to run the Cleezy server
   * separately. To enable, go to config.json and set ENABLED under Cleezy to true
   */
  async function getCleezyUrls() {
    const urlsFromDb = await getAllUrls(props.user.token);
    setIsCleezyDisabled(!!urlsFromDb.responseData.disabled);
    if (urlsFromDb.error) {
      setError(urlsFromDb.responseData);
    } else {
      setAllUrls(urlsFromDb.responseData);
    }
    setLoading(false);
  }

  async function handleCreateUrl() {
    const response = await createUrl(url, alias, props.user.token);
    if (!response.error) {
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
    getCleezyUrls();
  }, []);

  if (isCleezyDisabled) {
    return (
      <>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <ol>
          <li>bread</li>
          <li>kool aid</li>
        </ol>
        <h1>
          Cleezy page is disabled by default since you have to run the Cleezy server
          separately.
        </h1>
        <ol>
          <li>Modify <pre>api/config/config.json</pre> to include
            <code>
              'Cleezy': &#123;
                'ENABLED': true
              &#125;
            </code>
          </li>
          <li>
            Clone cleezy locally and follow the steps in
            {' '}<a href="https://github.com/SCE-Development/cleezy#readme" target="_blank">
              the readme
            </a> to run locally.
          </li>
          <li>
            number 3
          </li>
        </ol>
      </>
    );
  }

  return (
    <div className='url-shortener'>
      <Header title="Welcome to the url Shortener!!" />
      {!isCleezyDisabled && (
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
      )}
    </div>
  );
}
