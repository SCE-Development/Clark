import React, { useEffect, useState } from 'react';

import Header from '../../Components/Header/Header';
import { Container, Button, Row, Col, Input } from 'reactstrap';

export default function URLShortenerPage() {
  const [URL, setURL] = useState();
  const [alias, setAlias] = useState();

  return (
    <div>
      <Header title="Welcome to the URL Shortener!!" />
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '1rem'
            }}
        >
          <div>
            <Row>
              <Col>
                <Input placeholder='Enter URL'
                  onChange={e => setURL(e.target.value)} />
              </Col>
              <Col>
                <Input
                  placeholder='Enter alias'
                  onChange={e => setAlias(e.target.value)} />
              </Col>
            </Row>
          </div>
          <div>
            <Row style={{marginTop: '1rem '}}>
              <Col>
                <Button
                  disabled={!URL}
                  style={{width: '10rem', marginLeft: '1rem'}}>
                  Submit
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </div>
  );
}
