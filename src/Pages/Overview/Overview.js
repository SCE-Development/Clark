import React, { useState, useEffect } from 'react';
import './Overview.css';
const svg = require('./SVG');
import { getAllUsers, deleteUserByEmail } from '../../APIFunctions/User';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col
} from 'reactstrap';
import { membershipState } from '../../Enums';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
const enums = require('../../Enums.js');

export default function Overview(props) {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [users, setUsers] = useState([],);
  const [userToDelete, setUserToDelete] = useState({});
  const [queryResult, setQueryResult] = useState([],);
  const [query, setQuery] = useState('');
  const [toggle, setToggle] = useState(false,);
  const [currentQueryType, setCurrentQueryType] = useState('All',);
  const queryTypes = ['All', 'Pending', 'Officer', 'Admin', 'Alumni'];

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
    const apiResponse = await getAllUsers(props.user.token, query);
    if (!apiResponse.error) setUsers(apiResponse.responseData.items);
  }
  useEffect(() => {
    callDatabase();
  }, []);

  function filterUserByAccessLevel(accessLevel) {
    switch (accessLevel) {
      case 'Officer':
        return users.filter(
          data => data.accessLevel === membershipState.OFFICER
        );
      case 'Admin':
        return users.filter(
          data => data.accessLevel === membershipState.ADMIN
        );
      case 'Pending':
        return users.filter(
          data => data.accessLevel === membershipState.PENDING
        );
      case 'Alumni':
        return users.filter(
          data => data.accessLevel === membershipState.ALUMNI
        );
      default:
        return users;
    }
  }

  function updateQuery(value) {
    // taking care of empty values
    value = typeof value === 'undefined' ? '' : value;
    value = value.trim().toLowerCase();

    const userExists = user => {
      return (
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
      );
    };

    const filteredUsersByLevel = filterUserByAccessLevel(currentQueryType);
    const searchResult = filteredUsersByLevel.filter(data => userExists(data));
    const newQueryResult = searchResult.length
      ? searchResult
      : filteredUsersByLevel;

    setQueryResult(newQueryResult);
  }

  function handleToggle() {
    setToggle(!toggle);
  }


  return (
    <div className='flexbox-container'>

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
      <br>
      </br>
      <br>
      </br>
      <div className='layout'>
        <h6 id='search-tag'>Type a search, followed by the enter key </h6>
        <Row>
          <Col>
            <input
              className='input-overview'
              placeholder="search by 'first name, last name, or email'"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  callDatabase();
                }
              }}
              onChange={event => {
                setQuery(event.target.value);
                updateQuery(event.target.value);
              }}
            />
          </Col>
          <Col md={3}>
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
                      updateQuery('#InvalidSearch#');
                    }}
                  >
                    {type}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
          </Col>
        </Row>

        <table className='content-table' id='users'>
          <thead>
            <tr id='users-header'>
              {[
                'Name',
                'Email',
                'Printing',
                'Verified',
                'Membership Type',
                ' ',
                ''
              ].map((columnName) => {
                return <th key={columnName}>{columnName}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.email}>
                  <td>
                    <div className='name'>{formatFirstAndLastName(user)}</div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.pagesPrinted}/30</td>
                  <td>{mark(user.emailVerified)}</td>
                  <td>{enums.membershipStateToString(user.accessLevel)}</td>
                  <td>
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
                  <td>
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
        </table>
      </div>
    </div>
  );
}
