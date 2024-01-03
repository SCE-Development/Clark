import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../../config/config.json';

const {sitekey} = config;

class GoogleRecaptcha extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { isVerified: false };
    this.recapRef = React.createRef();
  }

  handleChange = recaptchaToken => {
    return new Promise((resolve, reject) => {
      if (recaptchaToken && recaptchaToken.length) this.props.setVerified(true);
      if (recaptchaToken === null) this.props.setVerified(false);
      resolve();
    });
  }

  render() {
    return (
      <ReCAPTCHA
        size='normal'
        theme='dark'
        ref={this.recapRef}
        sitekey={sitekey}
        onChange={this.handleChange}
      />
    );
  }
}
export default GoogleRecaptcha;
