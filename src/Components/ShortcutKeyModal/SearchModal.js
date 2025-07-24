import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import './SearchModal.css';
import { officerOrAdminRoutes, signedOutRoutes, memberRoutes, notAuthenticatedRoutes } from '../../Routes';
import { membershipState } from '../../Enums';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { searchAllUsers } from '../../APIFunctions/UserSearch';
import { getAllUrls } from '../../APIFunctions/Cleezy';
import { cleanStr } from './InputSanitizer';

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([...signedOutRoutes]);
  const [selectItem, setSelectItem] = useState(0);
  const { user } = useUser();
  const [errorMsg, setErrorMsg] = useState('');
  const { authenticated } = useAuth();
  // Maximum number of suggestions to display in the search dropdown
  const SHORTCUT_MAX_RESULT = 5;
  const DEBOUNCE_TIME = 400;
  const [isCleezyDisabled, setIsCleezyDisabled] = useState(false);

  /**
   * Returns the appropriate routes array based on the user's access level.
   * @dependencies user, authenticated
   */
  const routes = useMemo(() => {
    if (user?.accessLevel === membershipState.MEMBER)
      return [
        ...memberRoutes.filter(r => r.pageName !== 'Edit User Info'),
        ...signedOutRoutes
      ];
    if (user?.accessLevel >= membershipState.OFFICER)
      return [
        ...officerOrAdminRoutes.filter(r => r.pageName !== 'Edit User Info'),
        ...signedOutRoutes
      ];
    if (!authenticated)
      return [
        ...notAuthenticatedRoutes,
        ...signedOutRoutes
      ];
    return [...signedOutRoutes];
  }, [user, authenticated]);

  /**
   * Helper function updates the keyword when the user types
   * @param e - The input change event
   */
  const handleChanges = (e) => {
    setKeyword(e.target.value);
    setSelectItem(0);
  };

  /** This helper function clears search box and all suggestions */
  const clearSearchModal = () => {
    setSuggestions([...signedOutRoutes]);
    setKeyword('');
  };

  /**
   * Displays a confirmation prompt if the selected item is an external link.
   * @param {*} r - A route object from the suggestions list.
   * @returns Returns false if the route is an external site and navigate user to URL shortened page.
   */
  const externalSiteRoute = (r) => {
    if (r.type === 'external_url') {
      const encodedRoute = encodeURIComponent(JSON.stringify(r));
      window.location.href = `/short?data=${encodedRoute}`;
      return true;
    }
    return false;
  };

  const SuggestionsList = () => {
    if (suggestions.length === 0) return <></>;

    const topFiveItems = suggestions.slice(0, SHORTCUT_MAX_RESULT);
    return (
      <ul className='suggestion-list'>
        {topFiveItems.map((r, index) => ( // Still keep index to keep track of the selected item
          <li
            key={r.path} // Use r.path as key
            className={`suggestion-item ${index === selectItem ? 'active' : ''}`}
            onMouseEnter={() => setSelectItem(index)}
            onClick={() => {
              if (externalSiteRoute(r)) return;
              window.location.href = r.path;
              setOpen(false);
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>
              {r.type === 'user' ? '👤' : '📄'}
            </span>
            <div className='text-wrapper'>
              {r.pageName}
              <div className='hidden-tab'>
                {selectItem === index && (r.type === 'external_url' ? r.path : `${window.location.origin}${r.path}`)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  /**
   * Async function fetches all user data from the API
   * @param {string} token - User's authentication token.
   * @param {string} query - The search term.
   */
  const getUserData = async ({ token, query }) => {
    try {
      const apiResponse = await searchAllUsers({
        token,
        query
      });

      if (apiResponse.error || apiResponse.responseData.items.length === 0) return; // Exit early if there's an API error or an empty array

      const userMatches = apiResponse.responseData.items
        .map((u) => ({
          pageName: `${u.firstName} ${u.lastName} (${u.email})`,
          path: `/user/edit/${u._id}`,
          type: 'user'
        }));
      setSuggestions(prev => [...prev, ...userMatches]);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  /**
   * Async function fetches urls aliases from the API
   * @param {string} token - User's authentication token.
   * @param {string} searchQuery - The search term.
   * @param {number} page - The page number of search results.
   * @param {string} currentSortColumn - The column name to sort results by.
   * @param {string} currentSortOrder - Sort direction, e.g., 'ASC' or 'DESC'.
   */
  const getCleezyUrlsData = async ({
    token,
    searchQuery,
    page,
    currentSortColumn,
    currentSortOrder
  }) => {
    try {
      const sortColumn = currentSortColumn ?? 'created_at';
      const sortOrder = currentSortOrder ?? 'DESC';
      const sanitizedInput = cleanStr(searchQuery);
      const urlAPIRes = await getAllUrls({
        token,
        search: sanitizedInput,
        page,
        sortColumn: sortColumn,
        sortOrder: sortOrder
      });
      setIsCleezyDisabled(!!urlAPIRes.responseData.disabled);

      if (
        urlAPIRes.error ||
        !urlAPIRes.responseData.data ||
        urlAPIRes.responseData.data.length === 0
      ) return;

      const urlMatches = urlAPIRes.responseData.data
        .slice(0, 5)
        .map((u) => ({
          ...u,
          pageName: u.alias,
          path: u.url,
          type: 'external_url'
        }));
      setSuggestions(prev => [...prev, ...urlMatches]);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  /**
   * An effect that instantly shows all hardcoded routes.
   * @dependencies keyword, routes, open
   */
  useEffect(() => {
    if (!open) return;

    // Return if keyword is blank
    if (!keyword) {
      setSuggestions([...signedOutRoutes]);
      return;
    }

    // Instantly display for the hardcoded page recommendations
    const routeMatches = routes.filter((r) =>
      r.pageName?.toLowerCase().includes(keyword.toLowerCase())
    );
    setSuggestions(routeMatches);
  }, [open, keyword, routes]);

  /**
   * A debounce function that performs the search 400ms after the user stops typing.
   * @dependencies keyword, open, user.accessLevel, user.token, isCleezyDisabled
   */
  useEffect(() => {
    if (
      !open ||
      !user.accessLevel ||
      user?.accessLevel < membershipState.OFFICER ||
      // isCleezyDisabled ||
      !keyword
    ) return;

    const debounce = setTimeout(() => {
      getUserData({
        token: user.token,
        query: keyword
      });

      if (isCleezyDisabled) return;
      getCleezyUrlsData({
        token: user.token,
        searchQuery: keyword,
        page: 0,
        currentSortColumn: 'alias',
        currentSortOrder: 'ASC'
      });
    }, DEBOUNCE_TIME);

    return () => clearTimeout(debounce);
  }, [
    keyword,
    open,
    user.accessLevel,
    isCleezyDisabled,
    user.token
  ]);

  /**
   * A debounce function that performs the search 400ms after the user stops typing.
   * @dependencies keyword, open, user.accessLevel
   */
  // useEffect(() => {
  //   if (!open ||
  //     !user.accessLevel ||
  //     user?.accessLevel < membershipState.OFFICER ||
  //     !keyword) return;

  //   const debounce = setTimeout(() => {
  //     getUserData({
  //       token: user.token,
  //       query: keyword
  //     });
  //   }, DEBOUNCE_TIME);

  //   return () => clearTimeout(debounce);
  // }, [keyword, open, user.accessLevel]);

  /**
   * Executes a search when Enter is pressed
   * @dependencies selectItem, suggestions
   */
  const handleSearch = useCallback(() => {
    if (suggestions.length === 0) return; // Check if suggestions is empty

    const target = suggestions[selectItem];
    if (target && target.path) {
      if (externalSiteRoute(target)) return;
      window.location.href = target.path;
      setOpen(false);
      clearSearchModal();
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
        if (!open) {
          clearSearchModal();
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
        clearSearchModal();
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

  /**
   * Listens for mouse input and closes the search modal when the user clicks outside the modal content.
   * @dependencies open
   */
  useEffect(() => {
    const clickOut = (e) => {
      if (modalRef.current && !modalRef.current?.contains(e.target)) {
        setOpen(false);
        clearSearchModal();
      }
    };

    if (open) {
      window.addEventListener('mousedown', clickOut);
    }

    return () => {
      window.removeEventListener('mousedown', clickOut);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className='shortcut-search-modal'>
      <div ref={modalRef}>
        <div className='input-wrapper'>
          <input
            ref={inputRef}
            placeholder="Search here... (Ctrl + k)"
            value={keyword}
            onChange={handleChanges} />
          <SuggestionsList />
        </div>
        <div>
          {errorMsg && <p>{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
}
