import React, { useEffect, useState } from 'react';

import Header from '../../Components/Header/Header';
import './URLShortener-page.css';
import { getAllURLs, createURL, deleteURL } from '../../APIFunctions/Cleezy';
import { Container, Button, Row, Col, Input } from 'reactstrap';
import { trashcanSymbol } from '../Overview/SVG';

export default function URLShortenerPage(props) {
  const [URL, setURL] = useState();
  const [alias, setAlias] = useState();
  const [allURLs, setAllURLs] = useState([]);
  const [deleteAlias, setDeleteAlias] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
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
    if (!response.error) {
      setCreateURLResponse(response.responseData);
    }
  }

  async function handleDeleteURL(alias) {
    const response = await deleteURL(alias, props.user.token);
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
                    onClick={() => handleCreateURL()}>
                      Submit
                  </Button>
                </Col>
              </Row>
              {Object.keys(createURLResponse).length > 0 && (
                <Row>
                  <Col>
                    <p> URL saved with {String(createURLResponse.url)}
                        &nbsp;and alias { String(createURLResponse.alias) }</p>
                  </Col>
                </Row>
              )}
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
                    onClick={() => handleDeleteURL()}>
                      Delete URL
                  </Button>
                </Col>
              </Row>
            </div>
          </Container>
        )}
        {allURLs.length > 0 && (
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
                      <td>sce.sjsu.edu/s/{ URL.alias }</td>
                      <td>
                        <button
                          onClick={() => handleDeleteURL(URL.alias)}>
                          {trashcanSymbol()}
                        </button>
                      </td>
                    </tr>
                  );
                  // <Row key={index}>
                  //   <Col>
                  //     <h2>{index}</h2>
                  //     <p>{URL.url} saved with alias: {URL.alias}</p>
                  //   </Col>
                  //   <Col>
                  //   </Col>
                  // </Row>
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
