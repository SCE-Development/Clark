import ReCAPTCHA from 'react-google-recaptcha';

import config from '../../config/config.json';

const GoogleRecaptcha = ({ setCaptchaValue }) => {
  return (
    <ReCAPTCHA
      sitekey={config.sitekey}
      onChange={setCaptchaValue}
      theme='dark'
    />
  );
};

export default GoogleRecaptcha;
