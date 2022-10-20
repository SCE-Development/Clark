import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import './index.css';

import Routing from './Routing';
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkIfUserIsSignedIn } from './APIFunctions/Auth';
import { checkIfDarkThemeActive } from './APIFunctions/dark-theme';


function App(props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState();

  async function getAuthStatus() {
    setIsAuthenticating(true);
    const authStatus = await checkIfUserIsSignedIn();
    setAuthenticated(!authStatus.error);
    setUser({ token: authStatus.token, ...authStatus.responseData});
    setIsAuthenticating(false);
  }

  useEffect(() => {
    getAuthStatus();
    checkIfDarkThemeActive();
    // eslint-disable-next-line
  }, [])

  return (
    !isAuthenticating && (
      <>
        <Routing appProps={{ authenticated, setAuthenticated, user }} />
      </>
    )
  );
}

export default withRouter(App);

ReactDOM.render(<App />, document.getElementById('root'));
