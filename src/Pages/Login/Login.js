import React, { useState } from 'react';
import { Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import LoginInput from './LoginInput';
import { loginUser } from '../../APIFunctions/User';
import './login.css';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fields = [
    {
      type: 'email',
      placeholder: 'Email',
      handleChange: e => setEmail(e.target.value)
    },
    {
      type: 'password',
      placeholder: 'Password',
      handleChange: e => setPassword(e.target.value)
    }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const loginStatus = await loginUser(email, password);
    if (!loginStatus.error) {
      props.setAuthenticated(true);
      window.localStorage.setItem('jwtToken', loginStatus.token);
      window.location.reload();
    } else {
      setErrorMsg(
        loginStatus.responseData && loginStatus.responseData.data.message
      );
    }
  }

  return (
    <Container fluid className='background'>
      <Row className='form-card-login'>
        <form onSubmit={handleSubmit}>
          <img id='img' alt='sce logo' src='images/SCE-glow.png' />
          {errorMsg && <span>{errorMsg}</span>}
          {fields.map((field, index) => {
            return <LoginInput key={index} field={field} />;
          })}
          <button type='submit' id='loginBtn'>
              Login
          </button>
          <p id='SignUp'>
            <Link to='/register'>Create an account</Link>
          </p>
        </form>
      </Row>
    </Container>
  );
}
