import React, { useState, useEffect } from 'react';
import { healthCheck } from '../../APIFunctions/2DPrinting';
import {
  Spinner,
  Container
} from 'reactstrap';

export default function PrintingHealthCheck(props) {
  const [loading, setLoading] = useState(true);
  const [printerHealthy, setPrinterHealthy] = useState(false);

  async function checkPrinterHealth() {
    setLoading(true);
    const status = await healthCheck();
    if (status && !status.error) {
      setPrinterHealthy(true);
    } else {
      setPrinterHealthy(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    checkPrinterHealth();
  }, []);

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
