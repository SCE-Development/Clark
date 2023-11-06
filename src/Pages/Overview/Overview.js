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
    const startingElementNumber = (page * rowsPerPage) + 1;
    const endingElementNumber = amountOfUsersOnCurrentPage + pageOffset;
    if (users.length) {
      return (
        <Col className='pagination-control'>
          <Row className='flex-nowrap'>
            <Col>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0 || loading}
              >
                prev
              </button>
            </Col>
            <Col>
              <button
                onClick={() => setPage(page + 1)}
                disabled={endingElementNumber >= total || loading}
              >
                next
              </button>
            </Col>
          </Row>
          {!loading && (
            <Row>
              <Col style={{ marginLeft: '1.6em' }}>
                {startingElementNumber} - {endingElementNumber} / {total}
              </Col>
            </Row>
          )}
        </Col>
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
          {/* <Col md={3}>
            <ButtonDropdown
              isOpen={toggle}
              toggle={() => {
                handleToggle();
              }}
              style={{ width: '100%', top: '20%' }}
            >
              <DropdownToggle caret>{currentQueryType}</DropdownToggle>
              <DropdownMenu>
                {queryTypes.map((type) => (
                  <DropdownItem
                    key={type}
                    onClick={() => {
                      setCurrentQueryType(type);
                    }}
                  >
                    {type}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
          </Col> */}
        </div>
        <table>
          <thead>
            <div className='user-table-container'>
              <tr id='users-header'>
                {[
                  { title: 'Name', minWidth: '15em' },
                  { title: 'Email', minWidth: '23em' },
                  { title: 'Printing', minWidth: '5em' },
                  { title: 'Verified', minWidth: '5em' },
                  { title: 'Membership', minWidth: '7.5em' },
                  { title: '', minWidth: '4em' },
                  { title: '', minWidth: '5em' },
                ].map(({ title, minWidth }) => {
                  return (<th
                    className='text-center'
                    style={{ minWidth }}
                    key={title + minWidth}
                  >
                    {title}
                  </th>);
                })}
              </tr>
            </div>
          </thead>

          <div className='user-table-body-container'>
            <tbody className='user-table-body-container'>
              {users.map((user) => {
                return (
                  <tr key={user.email}>
                    <td className='first-name-cell'>
                      {formatFirstAndLastName(user)}
                    </td>
                    <td className='email-cell'>{user.email}</td>
                    <td className='printed-cell text-center'>{user.pagesPrinted}/30</td>
                    <td className='verified-cell text-center'>{mark(user.emailVerified)}</td>
                    <td className='membership-cell'>
                      {enums.membershipStateToString(user.accessLevel)}
                    </td>
                    <td className='delete-cell'>
                      <button
                        className='overview-icon'
                        onClick={() => {
                          setToggleDelete(!toggleDelete);
                          setUserToDelete(user);
                        }}
                      >
                        {svg.trashcanSymbol()}
                      </button>
                    </td>
                    <td className='edit-cell'>
                      <a target='_blank' href={`/user/edit/${user._id}`}>
                        <button className='overview-icon'>
                          {svg.editSymbol()}
                        </button>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </div>
        </table>
        {maybeRenderPagination()}
      </div>
    </div>
  );
}
