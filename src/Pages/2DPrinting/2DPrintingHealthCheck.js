import React, { useState, useEffect } from 'react';
import {
  Spinner,
  Container
} from 'reactstrap';

export default function PrintingHealthCheck(props) {
  const {printerHealthy, loading} = props;

  function renderPrinterHealth() {
    if (loading) {
      return <Spinner />;
    } else if (printerHealthy) {
      return <span>Printer is WORKING!</span>;
    } else {
      return <span>Printer is DOWN!</span>;
    }
  }

  return (
    <>
      <Container className='healthCheck'>
        <h1>
          {'Printer Status: '}
          {renderPrinterHealth()}
        </h1>
      </Container>
    </>
  );
}
