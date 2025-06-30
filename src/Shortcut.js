import { useState, useEffect } from 'react';
import { getSignedInRoutes, signedOutRoutes } from './Components/Routing/Routes';
import { useHistory } from 'react-router-dom';

function Shortcut({ appProps }) {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const history = useHistory();

  const { notAuthenticatedRoutes, officerOrAdminRoutes } = getSignedInRoutes(appProps.authenticated, appProps.user);
  const allRoutes = [...notAuthenticatedRoutes, ...officerOrAdminRoutes, ...signedOutRoutes];
  const routes = allRoutes.filter((route) => route.allowedIf !== false && route.pageName.toLowerCase().includes(text.toLowerCase()));

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && routes.length > 0) {
      history.push(routes[0].path);
      setIsVisible(false);
      setText('');
      window.location.reload();
    }
  };

  return (
    <>
      {isVisible &&
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-slate-900/50">
          <div className=" p-[15vh] text-[#939AA7] h-full">
            <div className="max-w-xl mx-auto divide-y divide-[#939AA7] bg-white rounded-md">
              <div className="relative flex justify-between px-4 py-2 text-sm ">
                <div className="flex items-center w-full gap-2 text-black">
                  <input
                    type="text"
                    className="w-full h-full p-2 bg-transparent focus-within:outline-none"
                    placeholder="Type a command..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <div className="p-2 text-black">
                {routes.map((route) => (
                  <p
                    key={route.path}
                    className="flex items-center w-full gap-2 text-black">
                    {route.pageName}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Shortcut;
