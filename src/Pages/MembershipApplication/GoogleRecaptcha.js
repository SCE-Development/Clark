import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { sitekey } from '../../config/config';

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
        theme='light'
        ref={this.recapRef}
        sitekey={sitekey}
        onChange={this.handleChange}
      />
    );
  }
}
export default GoogleRecaptcha;
