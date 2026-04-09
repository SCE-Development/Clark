import { useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import config from '../../config/config.json';

const GoogleRecaptcha = ({ setCaptchaValue, setCaptchaRef }) => {
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (typeof setCaptchaRef === 'function') {
      setCaptchaRef(recaptchaRef.current);
    }
  }, [recaptchaRef]);

  return (
    <ReCAPTCHA
      sitekey={config.sitekey}
      onChange={setCaptchaValue}
      ref={recaptchaRef}
      theme='dark'
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        width: '302px',
        height: '76px',
      }}
    />
  );
};

export default GoogleRecaptcha;
