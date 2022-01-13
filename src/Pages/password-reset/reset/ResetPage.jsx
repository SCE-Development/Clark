import React, { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './ResetPage.scss';

import {
  validateToken,
  resetPassword
} from '../../../APIFunctions/reset-password';

function ResetPage() {

  return (
    <>
      <div className='header-spacer'></div>
      <Container
        fluid
      >
        <Row>
          <Col xs="6">
          </Col>
          <Col xs="6">
            <Container className='input-card'>
              <ResetPasswordForm />
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const ResetPasswordForm = () => {
  const [token, setToken] = useState({
    token: '',
    valid: false
  });
  const [email, setEmail] = useState('');

  // Validate token and fetch email
  useEffect(() => {
    const validate = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (!token) {
        return;
      }
      const tokenValidationRes = (await validateToken(token));
      if (tokenValidationRes.success) {
        setToken({
          token: token,
          valid: true
        });
        setEmail(tokenValidationRes.email);
      }
    };
    validate();
  }, []);

  const [passwordInput, setPasswordInput] = useState({
    password: '',
    valid: true,
    message: ''
  });
  const [repeatPasswordInput, setRepeatPasswordInput] = useState({
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState('password');

  function handlePasswordInput(event) {
    const currentPasswordInput = event.target.value;
    setPasswordInput({
      valid: true,
      password: currentPasswordInput
    });
  }

  function handleRepeatPasswordInput(event) {
    const currentRepeatPasswordInput = event.target.value;
    setRepeatPasswordInput({
      password: currentRepeatPasswordInput,
    });
  }

  let notMatch = repeatPasswordInput.password === '' ?
    false :
    repeatPasswordInput.password !== passwordInput.password;

  function  handlePasswordVisibilityCheckbox(event) {
    const checked = event.target.checked;
    if (checked) {
      setPasswordVisible('text');
    } else {
      setPasswordVisible('password');
    }
  }

  async function handleNewPasswordSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (notMatch) {
      return;
    }

    const resetRes = await resetPassword(
      passwordInput.password,
      email,
      token.token
    );
    if (!resetRes.success) {
      setPasswordInput({
        ...passwordInput,
        valid: false,
        message: resetRes.detail
      });
      return;
    }
    setSubmitted(true);
  }

  if (!token.valid) {
    return (
      <>
        <p>The link has expired</p>
        <p>Please request another password reset link</p>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <p>Reset success</p>
        <p>Please log in with your new password</p>
      </>
    );
  }

  return (
    <>
      <h1 className='flex-left'>Create a new password</h1>
      <Form className='padding-top'>
        <FormGroup>
          <Label className='flex-left' for='password-input'>
            New password
          </Label>
          <Input
            type={passwordVisible}
            id='password-input'
            onChange={handlePasswordInput}
            invalid={!passwordInput.valid}
          />
          <FormFeedback className='text-left'>
            {passwordInput.message}
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label className='flex-left' for='repeat-password-input'>
            Repeat new password
          </Label>
          <Input
            type={passwordVisible}
            id='repeat-password-input'
            onChange={handleRepeatPasswordInput}
            invalid={notMatch}
          />
          <FormFeedback className='text-left'>
            The specified passwords must be identical
          </FormFeedback>
        </FormGroup>
        <Container className='flex-left'>
          <FormGroup
            check
            inline
          >
            <Input
              type='checkbox'
              onClick={handlePasswordVisibilityCheckbox}
            />
            <Label check>
              Show password
            </Label>
          </FormGroup>
        </Container>
        <Container className='flex-right padding-top-30'>
          <Button
            onClick={handleNewPasswordSubmit}
            type='submit'
            color='primary'
          >
            Update Password
          </Button>
        </Container>
      </Form>
    </>
  );
};

export { ResetPage };
