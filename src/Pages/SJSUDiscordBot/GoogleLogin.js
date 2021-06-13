import React, {useState} from 'react';
import {GoogleLogin,
  GoogleLogout} from 'react-google-login';
import { GOOGLE_API_CLIENT_ID } from '../../config/config.json';
import { getTempUser, addUser } from '../../APIFunctions/GoogleLoginPage.js';

function Verify(props){
  const [isLogined, setLoginState] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [username, setUsername] = useState('');
  const [discordID, setDiscordID] = useState(0);
  const [id, setID] = useState(props.match.params.id);
  const [validID, setValidID] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);
  const [SJSUEmail, setSJSUEmail] = useState(false);

  const getUser = async () => {
    await getTempUser(id).then(res => {
      if (!res.error){
        setUsername(res.responseData.username);
        setDiscordID(res.responseData.id);
        setValidID(true);
      }
    });
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const onSuccess = async (res) => {
    if(res.accessToken){
      setLoginState(true);
      setAccessToken(res.accessToken);
      if(res.profileObj.email.includes('sjsu.edu')){
        setSJSUEmail(true);
        const body = {
          discordID: discordID,
          googleTokenId: res.tokenId
        };
        await addUser(body);
      }
    }
  };

  const onLogout = (res) => {
    setLoginState(false);
    setAccessToken('');
  };

  const onLoginFailure = (res) => {
    setLoginFailed(true);
  };

  const onLogoutFailure = (res) => {
    setLogoutFailed(true);
  };

  return(
    <div>
      <section style={{margin: '100px'}}>
        <h1>SJSU SCE Discord Verify</h1>
        { !validID?
          <h5>Invalid ID: please type "/verify" in the discord chat again</h5>
          : isLogined ?
            logoutFailed ?
              <>
                <h6>Logout failed. Please try again or contact us. </h6>
                <GoogleLogout
                  clientId= {GOOGLE_API_CLIENT_ID}
                  buttonText='Logout'
                  onLogoutSuccess={ onLogout }
                  onFailure={ onLogoutFailure }
                />
              </> :
              accessToken && SJSUEmail ?
                <h5>
                Success: please type "/verify" in chat again to get your role
                </h5>
                : <>
                  <h5>
                  Verification failed.
                  Please logout and login again with an SJSU email.
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
                <h5> Login failed. Please login again. </h5>
                <h5>
                  If issue persists,
                  enable 3rd party cookies in your browser and try again.
                </h5>
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
                <h5> You are verifying as <b>{username}</b>.</h5>
                <h5> Please login with your SJSU email address.</h5>
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
