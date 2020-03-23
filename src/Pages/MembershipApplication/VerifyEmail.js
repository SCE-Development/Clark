import React from 'react';
import {
  sendVerificationEmail,
  validateVerificationEmail,
  setEmailToVerified
} from '../../APIFunctions/Profile';

export default class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailVerified: false,
      componentLoaded: false,
      email: '',
      hashedId: ''
    };
  }

  componentDidMount() {
    let querystring = this.props.location.search;
    querystring = querystring.substring(
      querystring.indexOf('?') + 1
    ).split('&');
    const params = {};
    let pair;
    const d = decodeURIComponent;

    for (let i = querystring.length - 1; i >= 0; i--) {
      pair = querystring[i].split('=');
      params[d(pair[0])] = d(pair[1] || '');
    }

    this.setState(
      {
        email: params.user,
        hashedId: params.id
      },
      () => {
        this.validateVerificationEmail();
      }
    );
  }

  validateVerificationEmail() {
    validateVerificationEmail(this.state.email, this.state.hashedId)
      .then(emailValidated => {
        if (!emailValidated.error) {
          this.setState({
            emailVerified: true,
            componentLoaded: true
          });

          setEmailToVerified(this.state.email);
        } else {
          this.setState({
            componentLoaded: true
          });
        }
      })
      .catch(error => {
        console.debug(error);
      });
  }

  resendVerificationEmail() {
    sendVerificationEmail(this.state.email);
  }

  render() {
    return (
      <div>
        {!this.state.componentLoaded ? (
          <div>
            <h3>Verifying</h3>
          </div>
        ) : this.state.emailVerified ? (
          <div>
            <h3 style={{ margin: '1em' }}>Your email has been verified</h3>
            <p style={{ margin: '2em' }}>
              You're good to go, fellow SCE member!
            </p>
          </div>
        ) : (
          <div>
            <h3 style={{ margin: '1em' }}>
              There was a problem verifying your email.
            </h3>
            <p
              style={{ margin: '2em', cursor: 'pointer' }}
              onClick={this.resendVerificationEmail.bind(this)}
            >
              Click here to resend the verification email.
            </p>
          </div>
        )}
      </div>
    );
  }
}
