import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, BrowserRouter } from 'react-router-dom';
import './index.css';

import Routing from './Routing';
import { checkIfUserIsSignedIn } from './APIFunctions/Auth';


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
      <BrowserRouter>
        <Routing appProps={{ authenticated, setAuthenticated, user }} />
      </BrowserRouter>
    )
  );
}

export default withRouter(App);

ReactDOM.render(<App />, document.getElementById('root'));
