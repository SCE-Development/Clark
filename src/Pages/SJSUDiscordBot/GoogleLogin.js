import React, {useState} from 'react';
import {GoogleLogin,
  GoogleLogout} from 'react-google-login';
import { GOOGLE_API_CLIENT_ID } from '../../config/config.json';
import axios from 'axios';
import { ApiResponse } from '../../../src/APIFunctions/ApiResponses';

function Verify(){
  const [isLogined, setLoginState] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [username, setUsername] = useState('');
  const [discordID, setDiscordID] = useState(0);
  const [id, setID] = useState(window.location.href.split('/')[5]);
  const [validID, setValidID] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [SJSUEmail, setSJSUEmail] = useState(false);

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

  const onSuccess = (res) => {
    let status = new ApiResponse();
    if(res.accessToken){
      setLoginState(true);
      setAccessToken(res.accessToken);
      if(res.profileObj.email.includes('sjsu.edu')){
        setSJSUEmail(true);
        const body = {
          discordID: discordID,
          googleTokenId: res.tokenId
        };
        axios
          .post('http://localhost:8080/api/verifiedUser/addUser_withGoogleToken'
            , body)
          .then(res => {
            status.responseData = res.data;
          })
          .catch(() => {
            status.error = true;
          });
        return status;
      }
    }
  };

  const onLogout = (res) => {
    setLoginState(false);
    setAccessToken('');
  };

  const onLoginFailure = (res) => {
    alert('Login failed');
    setLoginFailed(true);
  };

  const onLogoutFailure = (res) => {
    alert('Logout failed');
  };

  return(
    <div>
      <section style={{margin: '100px'}}>
        { !validID?
          <h5>Invalid ID: please type verify in the discord chat again</h5>
          : isLogined ?
            accessToken && SJSUEmail?
              <h5>
                Success: please type "verify" in chat to get your role
              </h5>
              : <>
                <h5>
                  Verification Failed.
                  Please logout and login again with an SJSU email
                </h5>
                <GoogleLogout
                  clientId= {GOOGLE_API_CLIENT_ID}
                  buttonText='Logout'
                  onLogoutSuccess={ onLogout }
                  onFailure={ onLogoutFailure }
                />
              </>
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
      </section>
    </div>
  );
}

export default Verify;
