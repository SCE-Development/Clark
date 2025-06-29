import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, BrowserRouter } from 'react-router-dom';
import './index.css';

import Routing from './Routing';
import Shortcut from './Shortcut';
import { checkIfUserIsSignedIn } from './APIFunctions/Auth';
import { UserContext } from './Components/context/UserContext';

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
    // eslint-disable-next-line
  }, [])

  return (
    !isAuthenticating && (
      <>
        <Routing appProps={{ authenticated, setAuthenticated, user }} />
        <Shortcut appProps={{ authenticated, user }} />
      </>
    )
  );
}

export default withRouter(App);

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
