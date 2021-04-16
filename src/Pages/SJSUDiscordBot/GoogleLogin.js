import React, {useState} from 'react';
import {GoogleLogin,
  GoogleLogout} from 'react-google-login';
import { GOOGLE_API_CLIENT_ID } from '../../config/config.json';
import axios from 'axios';
import { ApiResponse } from '../../../src/APIFunctions/ApiResponses';
import CookieConsent from 'react-cookie-consent';

function Verify(){
  const [isLogined, setLoginState] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [username, setUsername] = useState('');
  const [discordID, setDiscordID] = useState(0);
  const [id, setID] = useState(window.location.href.split('/')[5]);
  const [validID, setValidID] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const getTempUser = () => {
    let status = new ApiResponse();
    axios
      .post('http://localhost:8080/api/verifiedUser/getTempUser', {id})
      .then(res => {
        setUsername(res.data.username);
        setDiscordID(res.data.id);
        setValidID(true);
      })
      .catch(() => {
        status.error = true;
      });
    return status;
  };

  React.useEffect(()=> {
    getTempUser();
  }, []);

  const deleteTempUser = (()=>{
    let status = new ApiResponse();
    axios
      .post('http://localhost:8080/api/verifiedUser/getTempUser', {id})
      .then(res => {
        status.responseData = res.data;
      })
      .catch(() => {
        status.error = true;
      });
    return status;
  });

  const onSuccess = (res) => {
    let status = new ApiResponse();
    /* eslint-disable */
    console.log(res);
    /* eslint-disable */
    if(res.accessToken){
      setLoginState(true);
      setAccessToken(res.accessToken);
      deleteTempUser();
      const body = {
        discordID: discordID,
        googleTokenId: res.tokenId
      };
      axios
        .post('http://localhost:8080/api/verifiedUser/addUser_withGoogleToken',
          body)
        .then(res => {
          status.responseData = res.data;
        })
        .catch(() => {
          status.error = true;
        });
      return status;
    }
  };

  const logout = (res) => {
    setLoginState(false);
    setAccessToken('');
  };

  const onLoginFailure = (res) => {
    alert('Login failed');
    setLoginFailed(true);
  };

  return(
    <div>
      <section style={{margin: '100px'}}>
        { !validID?
          <h5>Invalid ID: please type verify in the discord chat again</h5>
          : isLogined ?
            accessToken ?
              <h5>
                Success: please type "verify" in chat to get your role
              </h5>
              : null
            :
            loginFailed ?
              <>
                <h4> Login Failed. Please login again. </h4>
                <GoogleLogin
                  clientId= {GOOGLE_API_CLIENT_ID}
                  buttonText='Login'
                  onSuccess={ onSuccess }
                  onFailure={ onLoginFailure }
                  cookiePolicy={ 'single_host_origin' }
                  responseType='code,token'
                />
              </>:
              <>
                <h4> You are verifying as <b>{username}</b></h4>
                <h5> Please login with SJSU email</h5>
                <GoogleLogin
                  clientId= {GOOGLE_API_CLIENT_ID}
                  buttonText='Login'
                  onSuccess={ onSuccess }
                  onFailure={ onLoginFailure }
                  cookiePolicy={ 'single_host_origin' }
                  responseType='code,token'
                />
              </>
        }
        <CookieConsent
          location='bottom'
          buttonText='Accept Cookies'
          cookieName='authCookie'
          style={{ background:'#2B373B' }}
          buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.{' '}
        </CookieConsent>
      </section>
    </div>
  );


}

export default Verify;
