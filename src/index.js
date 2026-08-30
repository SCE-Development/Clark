import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import Routing from './Routing';
import { checkIfUserIsSignedIn } from './APIFunctions/Auth';
import { SceContext } from './Components/context/SceContext';
import SearchModal from './Components/ShortcutKeyModal/SearchModal';
import BackgroundColorContextProvider from './Components/context/BackgroundColorContext';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState({});

  async function getAuthStatus() {
    setIsAuthenticating(true);
    const authStatus = await checkIfUserIsSignedIn();
    setAuthenticated(!authStatus.error && !!authStatus.token);
    if (authStatus.token){
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
      <SceContext.Provider value={{user, setUser, authenticated, setAuthenticated}}>
        <BackgroundColorContextProvider>
          <BrowserRouter>
            <SearchModal/>
            <Routing/>
          </BrowserRouter>
        </BackgroundColorContextProvider>
      </SceContext.Provider>
    )
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
