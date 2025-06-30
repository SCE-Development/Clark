import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import style from './SearchModal.module.css';
import { officerSignedInRoutes, signedOutRoutes, memberSignedInRoutes } from '../../RouteConfig';
import { membershipState } from '../../Enums';
import { getAllUsers } from '../../APIFunctions/User';
import { useUser } from '../context/UserContext';

export default function SearchModal(props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const prevKeyword = useRef('');
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectItem, setSelectItem] = useState(0);
  const [users, setUsers] = useState([]);
  const { user } = useUser();

  const routes = useMemo(() => {
    if (user.accessLevel === membershipState.MEMBER) return [...memberSignedInRoutes, ...signedOutRoutes];
    if (user.accessLevel >= membershipState.OFFICER) return [...officerSignedInRoutes, ...memberSignedInRoutes, ...signedOutRoutes, ...users];
    return [...signedOutRoutes];
  }, [user.accessLevel, users]);

  function handleChanges(e) {
    setKeyword(e.target.value);
    setSelectItem(0);
  }

  async function getUserData() {
    try {
      const apiResponse = await getAllUsers({
        token: user.token,
        query: keyword,
        page: 0,
        sortColumn: 'firstName',
        sortOrder: 'asc'
      });
      setUsers(apiResponse.responseData.items);
      // console.log('api fetch') // For debug
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * An effect that instantly shows all hardcoded routes.
   * @dependencies keyword, routes, open
   */
  useEffect(() => {
    if (!open) return;

    // Instantly display for the hardcoded page recommendations
    const routeMatches = routes.filter((r) =>
      r.pageName?.toLowerCase().includes(keyword.toLowerCase())
    );
    setSuggestions(routeMatches);
  }, [open, keyword, routes]);

  /**
   * A debounce function that performs the search 400ms after the user stops typing.
   * @dependencies keyword, routes
   */
  useEffect(() => {
    if (!open || !user.accessLevel || user?.accessLevel < membershipState.OFFICER) return;

    const debounce = setTimeout(() => {
      // Only fetch users when there is a change in keyword
      if (prevKeyword.current !== keyword) {
        getUserData();
        prevKeyword.current = keyword; // Update previous keyword after fetching for new data
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [keyword, open, user.accessLevel]);

  /**
   * Combines hardcoded route suggestions with user search results
   * after the debounced fetch has updated the user list.
   * Only runs when the user list is updated, and search is open.
   * @dependencies users
   */
  useEffect(() => {
    if (!open || user.accessLevel < membershipState.OFFICER || !keyword) return;

    const routeMatches = routes.filter((r) =>
      r.pageName?.toLowerCase().includes(keyword.toLowerCase())
    );

    // Filter users by name or email
    const userMatches = users.filter((u) => {
      const searchKey = keyword.toLowerCase();
      return (
        u.firstName?.toLowerCase().includes(searchKey) ||
        u.lastName?.toLowerCase().includes(searchKey) ||
        u.email?.toLowerCase().includes(searchKey)
      );
    }).map((u) => ({
      pageName: `${u.firstName} ${u.lastName} (${u.email})`,
      path: `/user/edit/${u._id}`,
      type: 'user'
    }));

    setSuggestions([...routeMatches, ...userMatches]);
  }, [users]);

  const handleSearch = useCallback(() => {
    const target = suggestions[selectItem];

    if (target && target.path) {
      window.location.href = target.path;
      setOpen(false);
    }

  }, [suggestions, selectItem]);

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
        if (suggestions.length > 0) setSelectItem(prev => Math.min(prev + 1, 4));
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
    <div className={style['modal']}>
      <div className={style['input-wrapper']}>
        <input
          ref={inputRef}
          placeholder="Search here"
          value={keyword}
          onChange={handleChanges} />

        {suggestions.length > 0 && (
          <ul className={`${style['suggestion-list']}`}>
            {suggestions.map((r, index) => (
              <li
                key={index}
                className={`${style['suggestion-item']} ${index === selectItem ? style['active'] : ''}`}
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
                <div className={style['hidden-tab']}>{selectItem === index && r.path}</div>
              </li>
            )).slice(0, 5)}
          </ul>
        )}
      </div>
    </div>
  );
}
