import React from 'react';
import { sendVerificationEmail } from '../../APIFunctions/Mailer';
import { validateVerificationEmail } from '../../APIFunctions/Auth';

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
    const urlParams = new URLSearchParams(this.props.location.search);
    const email = urlParams.get('user');
    const hashedId = urlParams.get('id');

    this.setState(
      {
        email: email,
        hashedId: hashedId
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
      <div className='flex justify-center'>
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
              style={
                {
                  margin: '1em',
                  cursor: 'pointer',
                  color:'blue',
                  textDecoration: 'underline'
                }
              }
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
