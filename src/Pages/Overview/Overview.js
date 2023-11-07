import React, { useState, useEffect } from 'react';
import './Overview.css';
const svg = require('./SVG');
import { getAllUsers, deleteUserByEmail } from '../../APIFunctions/User';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
import {
  // ButtonDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  Row,
  Col,
  // Table,
} from 'reactstrap';
// import { membershipState } from '../../Enums';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
const enums = require('../../Enums.js');

export default function Overview(props) {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paginationText, setPaginationText] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [userToDelete, setUserToDelete] = useState({});
  const [queryResult, setQueryResult] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [query, setQuery] = useState('');
  // const [toggle, setToggle] = useState(false);
  // const [currentQueryType, setCurrentQueryType] = useState('All');
  // const queryTypes = ['All', 'Pending', 'Officer', 'Admin', 'Alumni'];

  async function deleteUser(user) {
    const deleteEmailResponse = await deleteUserByEmail(
      user.email,
      props.user.token
    );
    if (!deleteEmailResponse.error) {
      if (user.email === props.user.email) {
        // logout
        window.localStorage.removeItem('jwtToken');
        window.location.reload();
        return window.alert('Self-deprecation is an art');
      }
      setUsers(
        users.filter(
          child => !child.email.includes(user.email)
        )
      );
      setQueryResult(
        queryResult.filter(
          child => !child.email.includes(user.email)
        )
      );
    }
  }

  function mark(bool) {
    return bool ? svg.checkMark() : svg.xMark();
  }

  async function callDatabase() {
    setLoading(true);
    const apiResponse = await getAllUsers(props.user.token, query, page);
    if (!apiResponse.error) {
      setUsers(apiResponse.responseData.items);
      setTotal(apiResponse.responseData.total);
      setRowsPerPage(apiResponse.responseData.rowsPerPage);
    }
    setLoading(false);
  }

  useEffect(() => {
    callDatabase();
  }, [page]);

  useEffect(() => {

    const amountOfUsersOnCurrentPage = Math.min((page + 1) * rowsPerPage, users.length);
    const pageOffset = page * rowsPerPage;
    const startingElementNumber = (page * rowsPerPage) + 1;
    const endingElementNumber = amountOfUsersOnCurrentPage + pageOffset;
    setPaginationText(`${startingElementNumber} - ${endingElementNumber} / ${total}`);
  }, [page, rowsPerPage, users, total]);

  // function filterUserByAccessLevel(accessLevel) {
  //   switch (accessLevel) {
  //     case 'Officer':
  //       return users.filter(
  //         data => data.accessLevel === membershipState.OFFICER
  //       );
  //     case 'Admin':
  //       return users.filter(
  //         data => data.accessLevel === membershipState.ADMIN
  //       );
  //     case 'Pending':
  //       return users.filter(
  //         data => data.accessLevel === membershipState.PENDING
  //       );
  //     case 'Alumni':
  //       return users.filter(
  //         data => data.accessLevel === membershipState.ALUMNI
  //       );
  //     default:
  //       return users;
  //   }
  // }

  // function updateQuery(value) {
  //   // taking care of empty values
  //   value = typeof value === 'undefined' ? '' : value;
  //   value = value.trim().toLowerCase();

  //   const userExists = user => {
  //     return (
  //       user.firstName.toLowerCase().includes(value) ||
  //       user.lastName.toLowerCase().includes(value) ||
  //       user.email.toLowerCase().includes(value)
  //     );
  //   };

  //   const filteredUsersByLevel = filterUserByAccessLevel(currentQueryType);
  //   const searchResult = filteredUsersByLevel.filter(data => userExists(data));
  //   const newQueryResult = searchResult.length
  //     ? searchResult
  //     : filteredUsersByLevel;

  //   setQueryResult(newQueryResult);
  // }

  // function handleToggle() {
  //   setToggle(!toggle);
  // }

  function maybeRenderPagination() {
    const amountOfUsersOnCurrentPage = Math.min((page + 1) * rowsPerPage, users.length);
    const pageOffset = page * rowsPerPage;
    const endingElementNumber = amountOfUsersOnCurrentPage + pageOffset;
    if (users.length) {
      return (
        <div className='pagination-container'>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0 || loading}
          >
            prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={endingElementNumber >= total || loading}
          >
            next
          </button>
          <span>
            <br></br>
            {loading ? '...' : paginationText}
          </span>
        </div>
      );
    }
    return <></>;
  }

  return (
    <div className='overview-container'>
      <ConfirmationModal {... {
        headerText: `Delete ${userToDelete.firstName} ${userToDelete.lastName} ?`,
        bodyText: `Are you sure you want to delete 
          ${userToDelete.firstName}? They'll be gone forever if you do.`,
        confirmText: `Yes, goodbye ${userToDelete.firstName}`,
        cancelText: 'No, they\'re chill',
        toggle: () => setToggleDelete(!toggleDelete),
        handleConfirmation: () => {
          deleteUser(userToDelete);
          setToggleDelete(!toggleDelete);
        },
        open: toggleDelete
      }
      } />
      <div className='layout'>
        <div className='overview-search-container'>
          <h6 id='search-tag'>Type a search, followed by the enter key </h6>
          <input
            className='input-overview'
            placeholder="search by 'first name, last name, or email'"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                // instead of calling the backend directory, set
                // the page we are on to zero if the current page
                // we are on isn't the first page (value of 0).
                // by doing this, the useEffect will call the backend
                // for us with the correct page and query.
                if (page) {
                  setPage(0);
                } else {
                  callDatabase();
                }
              }
            }}
            onChange={event => {
              setQuery(event.target.value);
            }}
          />
        </div>
        <div className='table'>
          <div className='tr th' id='users-header'>
            {[
              {title: 'Name', className: 'name-cell'},
              {title: 'Email', className: 'email-cell'},
              {title: 'Printing', className: 'printing--cell'},
              {title: 'Verified', className: 'verified-cell'},
              {title: 'Membership', className: 'membership-cell'},
              {title: 'Delete', className: 'delete-cell'},
            ].map(({title, className}) => {
              return (<div
                className={`td text-center ${className}`}
                key={title}
              >
                {title}
              </div>);
            })}
          </div>
          {users.map((user) => {
            return (
              <div className='tr' key={user.email}>
                <div className='td name-cell'>
                  <a target='_blank' href={`/user/edit/${user._id}`}>
                    {formatFirstAndLastName(user)}
                  </a>
                </div>
                <div className='td email-cell'>{user.email}</div>
                <div className='td printed-cell overview-center'>{user.pagesPrinted}/30</div>
                <div className='td verified-cell overview-center'>{mark(user.emailVerified)}</div>
                <div className='td membership-cell overview-center'>
                  {enums.membershipStateToString(user.accessLevel)}
                </div>
                <div className='td delete-cell overview-center'>
                  <button
                    className='overview-icon'
                    onClick={() => {
                      setToggleDelete(!toggleDelete);
                      setUserToDelete(user);
                    }}
                  >
                    {svg.trashcanSymbol()}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {maybeRenderPagination()}
      </div>
    </div>
  );
}
