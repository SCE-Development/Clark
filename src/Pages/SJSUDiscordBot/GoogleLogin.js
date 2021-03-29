import React, {useState} from 'react';
import {GoogleLogin,
  GoogleLogout} from 'react-google-login';
import { REACT_APP_GOOGLE_CLIENT_ID } from '../../config/config.json';
const clientId = REACT_APP_GOOGLE_CLIENT_ID;

function Verify(){
  const [isLogined, setLoginState] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const onSuccess = (res) => {
    if(res.accessToken){
      setLoginState(true);
      setAccessToken(res.accessToken);
    }
    /* eslint-disable no-console */
    console.log(res.profileObj);
    /* eslint-disable no-console */
  };

  const logout = (res) => {
    setLoginState(false);
    setAccessToken('');
  };

  const onFailure = (res) => {
    alert('Failed to Login!');
  };

  return(
    <div>
      <section style={{margin: '100px'}}>
        <h3> Log in below to verify your account!</h3>
        { isLogined ?
          <GoogleLogout
            clientId= {clientId}
            buttonText='Logout'
            onLogoutSuccess={ logout }
            onFailure={ onFailure }
          >
          </GoogleLogout>: <GoogleLogin
            clientId= {clientId}
            buttonText='Login'
            onSuccess={ onSuccess }
            onFailure={ onFailure }
            cookiePolicy={ 'single_host_origin' }
            responseType='code,token'
          />
        }
        { accessToken ?
          <h5>
            Success: please type "verify" in chat to get your role
          </h5>
          : null }
      </section>
    </div>
  );


}

export default Verify;
