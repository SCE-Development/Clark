import React, { useState } from 'react';
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

import {
  requestReset
} from '../../../APIFunctions/reset-password';
import './RequestResetPage.scss';

function RequestResetPage(props) {
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
              <ResetEmailForm />
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const ResetEmailForm = () => {
  const [emailInput, setEmailInput] = useState({
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionState, setSubmissionState] = useState({
    valid: true,
    message: ''
  });

  // https://emailregex.com/
  function validateEmail() {
    // eslint-disable-next-line
    const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailExpression.test(emailInput.email);
  }

  function handleEmailInput(event) {
    const currentEmailInput = event.target.value;
    setEmailInput({
      email: currentEmailInput,
    });
    setSubmissionState({
      valid: true,
      message: ''
    });
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!validateEmail()) {
      setSubmissionState({
        valid: false,
        message:
          'Please input a valid email address'
      });
      return;
    }
    const result = await requestReset(emailInput.email);
    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmissionState({
        valid: false,
        message:
          'Something went wrong. Please try again or contact us on Discord'
      });
    }
  }

  if (submitted) {
    return (
      <>
        <p>Your reset link is on the way</p>
        <p>
          If an account for "{emailInput.email}" exists,&nbsp;
          we'll send you a reset link to create a new password.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className='flex-left'>Password Reset</h1>
      <p className='flex-left email-prompt lead'>
        Enter your email address that you used to register.
        We'll send you an email with a link to reset your password.
      </p>
      <Form>
        <FormGroup className='email-form'>
          <Label className='flex-left' for='emailToReset'>
            Email address
          </Label>
          <Input
            type='email'
            id='emailToReset'
            name='email'
            onChange={handleEmailInput}
            invalid={!submissionState.valid}
          />
          <FormFeedback className='text-left'>
            {submissionState.message}
          </FormFeedback>
        </FormGroup>
        <Container className='flex-right'>
          <Button
            onClick={handleEmailSubmit}
            type='submit'
            color='primary'
          >
            Continue
          </Button>
        </Container>
      </Form>
    </>
  );
};

export { RequestResetPage };
