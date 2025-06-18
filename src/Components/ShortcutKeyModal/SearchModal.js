import React, { useRef, useEffect, useState, useCallback } from 'react';
import style from './SearchModal.module.css';
import { officerSignedInRoutes, signedOutRoutes, memberSignedInRoutes } from '../../RouteConfig';
import { membershipState } from '../../Enums';
import { getAllUsers } from '../../APIFunctions/User';

export default function SearchModal(props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectItem, setSelectItem] = useState(0);
  let routes = [];
  const [users, setUsers] = useState([]);

  if (props.user.accessLevel === membershipState.MEMBER) {
    routes = [...memberSignedInRoutes, ...signedOutRoutes];
  } else if (props.user.accessLevel >= membershipState.OFFICER) {
    routes = [...officerSignedInRoutes, ...memberSignedInRoutes, ...signedOutRoutes, ...users];
  } else routes = [...signedOutRoutes];

  function handleChanges(e) {
    setKeyword(e.target.value);
    setSelectItem(0);
  }

  async function getUserData() {
    try {
      const apiResponse = await getAllUsers({
        token: props.user.token,
        query: keyword,
        page: 0,
        sortColumn: 'firstName',
        sortOrder: 'asc'
      });
      setUsers(apiResponse.responseData.items);
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * A debounce function that performs the search 800ms after the user stops typing.
   * @dependencies keyword, routes
   */
  useEffect(() => {
    if (!open) return;

    const debounce = setTimeout(() => {
      if (props.user.accessLevel >= membershipState.OFFICER) getUserData();
      const matches = [
        ...routes.filter((r) =>
          r.pageName?.toLowerCase().includes(keyword.toLowerCase())
        ),
        // Filter users by name or email
        ...users.filter((user) => {
          const searchKey = keyword.toLowerCase();
          return (
            user.firstName?.toLowerCase().includes(searchKey) ||
            user.lastName?.toLowerCase().includes(searchKey) ||
            user.email?.toLowerCase().includes(searchKey)
          );
        }).map((user) => ({
          pageName: `${user.firstName} ${user.lastName} (${user.email})`,
          path: `/user/edit/${user._id}`,
          type: 'user'
        }))
      ];

      setSuggestions(matches);
    }, 800);

    return () => clearTimeout(debounce);
  }, [keyword, routes, open]);

  const handleSearch = useCallback(() => {
    const target = suggestions[selectItem];

    if (target && target.path) {
      window.location.href = target.path;
      setOpen(false);
    }

  }, [suggestions, selectItem]);

  useEffect(() => {
    const listener = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || (e.key === 'K'))) {
        e.preventDefault();
        setOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'Enter' && open) {
        e.preventDefault();
        handleSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (suggestions.length > 0) setSelectItem(prev => Math.min(prev + 1, suggestions.length - 1));
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
          <ul className={style['suggestion-list']}>
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
