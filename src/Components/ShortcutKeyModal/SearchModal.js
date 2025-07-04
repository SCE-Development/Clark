import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import './SearchModal.css';
import { officerOrAdminRoutes, signedOutRoutes, memberRoutes, notAuthenticatedRoutes } from '../../Routes';
import { membershipState } from '../../Enums';
import { useUser } from '../context/UserContext';

export default function SearchModal({ appProps }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectItem, setSelectItem] = useState(0);
  const { user } = useUser();
  const [errorMsg, setErrorMsg] = useState('');

  const routes = useMemo(() => {
    if (user.accessLevel === membershipState.MEMBER) return [...memberRoutes, ...signedOutRoutes];
    if (user.accessLevel >= membershipState.OFFICER) return [...officerOrAdminRoutes, ...signedOutRoutes];
    if (!appProps.authenticated) return [...notAuthenticatedRoutes, ...signedOutRoutes];
    return [...signedOutRoutes];
  }, [user.accessLevel]);

  function handleChanges(e) {
    setKeyword(e.target.value);
    setSelectItem(0);
  }

  function getSuggestions() {
    if (suggestions.length === 0) return <></>;

    const topFiveItems = suggestions.slice(0, 5);
    return (
      <ul className='suggestion-list'>
        {topFiveItems.map((r, index) => ( // Still keep index to keep track of the selected item
          <li
            key={r.path} // Use r.path as key
            className={`suggestion-item ${index === selectItem ? 'active' : ''}`}
            onMouseEnter={() => setSelectItem(index)}
            onClick={() => {
              window.location.href = r.path;
              setOpen(false);
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>
              {r.type === 'user' ? '👤' : '📄'}
            </span>
            {r.pageName}
            <div className='hidden-tab'>{selectItem === index && `${window.location.origin}${r.path}`}</div>
          </li>
        ))}
      </ul>
    );
  }

  /**
   * An effect that instantly shows all hardcoded routes.
   * @dependencies keyword, routes, open
   */
  useEffect(() => {
    if (!open) return;

    // Return if keyword is blank
    if (!keyword) {
      setSuggestions([]);
      return;
    }

    // Instantly display for the hardcoded page recommendations
    const routeMatches = routes.filter((r) =>
      r.pageName?.toLowerCase().includes(keyword.toLowerCase())
    );
    setSuggestions(routeMatches);
  }, [open, keyword, routes]);

  /**
   * Executes a search when Enter is pressed
   * @dependencies selectItem, suggestions
   */
  const handleSearch = useCallback(() => {
    if (suggestions.length === 0) return; // Check if suggestions is empty

    const target = suggestions[selectItem];
    if (target && target.path) {
      window.location.href = target.path;
      setOpen(false);
    }
  }, [suggestions, selectItem]);

  /**
   * Listens for keyboard input and executes shortcut actions.
   * @dependencies open, suggestions, selectItem
   */
  useEffect(() => {
    const listener = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'Enter' && open) {
        e.preventDefault();
        handleSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (suggestions.length > 0) {
          const minLength = Math.min(suggestions.length - 1, 4);
          setSelectItem(prev => Math.min(prev + 1, minLength));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectItem(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open, suggestions, selectItem]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className='shortcut-search-modal'>
      <div className='input-wrapper'>
        <input
          ref={inputRef}
          placeholder="Search here"
          value={keyword}
          onChange={handleChanges} />

        {getSuggestions()}
      </div>
      <div>
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
}
