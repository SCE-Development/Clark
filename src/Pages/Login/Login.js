import React, { useState, useEffect } from 'react';
import { Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import LoginInput from './LoginInput';
import { loginUser } from '../../APIFunctions/User';
import './login.css';

import spring from '../MembershipApplication/assets/spring.jpg';
import fall from '../MembershipApplication/assets/fall2.jpeg';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [semesterImage, setSemesterImage] = useState({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${spring})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'noRepeat',
    minHeight: '680px'
  });

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

  function getSemesterImage() {
    const month = new Date().getMonth() + 1;
    if (month >= 6) {
      setSemesterImage({
        ...semesterImage,
        backgroundImage: `url(${fall})`
      });
    }
  }

  useEffect(() => {
    getSemesterImage();
  });

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

  return (
    <Container fluid style={semesterImage}>
      <Row className='form-card-login'>
        <form onSubmit={handleSubmit}>
          <div>
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
          </div>
        </form>
      </Row>
    </Container>
  );
}
