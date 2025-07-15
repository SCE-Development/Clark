import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import Routing from './Routing';
import { checkIfUserIsSignedIn } from './APIFunctions/Auth';
import { UserContext } from './Components/context/UserContext';
import SearchModal from './Components/ShortcutKeyModal/SearchModal';
import { AuthContext } from './Components/context/AuthContext';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState();

  async function getAuthStatus() {
    setIsAuthenticating(true);
    const authStatus = await checkIfUserIsSignedIn();
    setAuthenticated(!authStatus.error && !!authStatus.token);
    if (!!authStatus.token){
      setUser({ token: authStatus.token, ...authStatus.responseData});
    }
    setIsAuthenticating(false);
  }

  useEffect(() => {
    getAuthStatus();
    // eslint-disable-next-line
  }, [])

  return (
    !isAuthenticating && (
      <UserContext.Provider value={{ user, setUser }}>
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
          <BrowserRouter>
            <SearchModal/>
            <Routing/>
          </BrowserRouter>
        </AuthContext.Provider>
      </UserContext.Provider>
    )
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
