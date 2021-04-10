import React, {useState} from 'react';
import {GoogleLogin,
  GoogleLogout} from 'react-google-login';
import { GOOGLE_API_CLIENT_ID } from '../../config/config.json';
import axios from 'axios';
import { ApiResponse } from '../../../src/APIFunctions/ApiResponses';
const clientId = GOOGLE_API_CLIENT_ID;

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

  const onSuccess = (res) => {
    if(res.accessToken){
      setLoginState(true);
      setAccessToken(res.accessToken);
      // const user = {
      //   discordID: discordID,
      //   googleId: res.profileObj.googleId,
      //   email: res.profileObj.email,
      //   name: res.profileObj.name,
      //   givenName: res.profileObj.givenName,
      //   familyName: res.profileObj.familyName
      // };
      // axios
      //   .post('http://localhost:8080/api/verifiedUser/AddUser', {id})
      //   .then(res => {
      //     setUsername(res.data.username);
      //     setValidID(true);
      //   })
      //   .catch(() => {
      //     status.error = true;
      //   });
      // return status;
    }
    /* eslint-disable no-console */
    console.log(res.profileObj);
    /* eslint-disable no-console */
  };

  const logout = (res) => {
    setLoginState(false);
    setAccessToken('');
  };

  const onLoginFailure = (res) => {
    alert('Login failed');
  };

  const onLogoutFailure = (res) => {
    alert('Logout failed');
  };

  /* eslint-disable no-console */
  console.log(clientId);
  /* eslint-disable no-console */

  return(
    <div>
      <section style={{margin: '100px'}}>
        { !validID?
          <h5>Invalid ID: please type verify in the chat again</h5>
          :<h4> You are verifying as <b>{username}</b></h4>
        }
        <h5> Please login with SJSU email</h5>
        { isLogined ?
          <GoogleLogout
            clientId= {clientId}
            buttonText='Logout'
            onLogoutSuccess={ logout }
            onFailure={ onLogoutFailure }
          >
          </GoogleLogout>: <GoogleLogin
            clientId= {clientId}
            buttonText='Login'
            onSuccess={ onSuccess }
            onFailure={ onLoginFailure }
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
