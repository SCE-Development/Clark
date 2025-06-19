import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import Routing from './Routing';
import { checkIfUserIsSignedIn } from './APIFunctions/Auth';
import SearchModal from './Components/ShortcutKeyModal/SearchModal';


function App(props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState();

  async function getAuthStatus() {
    setIsAuthenticating(true);
    const authStatus = await checkIfUserIsSignedIn();
    setAuthenticated(!authStatus.error);
    setUser({ token: authStatus.token, ...authStatus.responseData });
    setIsAuthenticating(false);
  }

  useEffect(() => {
    getAuthStatus();
    // eslint-disable-next-line
  }, [])

  return (
    !isAuthenticating && (
      <BrowserRouter>
        <SearchModal user={ user } />
        <Routing appProps={{ authenticated, setAuthenticated, user }} />
      </BrowserRouter>
    )
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
