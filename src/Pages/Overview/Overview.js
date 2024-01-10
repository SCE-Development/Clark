import React, { useState, useEffect } from 'react';

const svg = require('./SVG');
import { getAllUsers, deleteUserByEmail } from '../../APIFunctions/User';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
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
    setPaginationText(
      <>
        <p className='md:hidden'>
          {startingElementNumber} - {endingElementNumber} / {total}
        </p>
        <p className="hidden md:inline-block">
          Showing <span className='font-medium'>{startingElementNumber}</span> to <span className='font-medium'>{endingElementNumber}</span> of <span className='font-medium'>{total}</span> results
        </p>
      </>
    );
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
        <nav className='flex justify-start py-6'>
          <div className='flex items-center navbar-start'>
            <span>
              {loading ? '...' : paginationText}
            </span>
          </div>
          <div className='flex justify-end space-x-3 navbar-end'>
            <button
              className='btn'
              onClick={() => setPage(page - 1)}
              disabled={page === 0 || loading}
            >
              previous
            </button>
            <button
              className='btn'
              onClick={() => setPage(page + 1)}
              disabled={endingElementNumber >= total || loading}
            >
              next
            </button>
          </div>
        </nav>
      );
    }
    return <></>;
  }

  return (
    <div className='overview-container bg-gradient-to-r from-gray-800 to-gray-600 min-h-[100dvh]'>
      <ConfirmationModal {... {
        headerText: `Delete ${userToDelete.firstName} ${userToDelete.lastName} ?`,
        bodyText: `Are you sure you want to delete 
          ${userToDelete.firstName}? They'll be gone forever if you do.`,
        confirmText: `Yes, goodbye ${userToDelete.firstName}`,
        cancelText: 'No, they\'re chill',
        confirmClassAddons: 'bg-red-600 hover:bg-red-500',
        handleConfirmation: () => {
          deleteUser(userToDelete);
          setToggleDelete(!toggleDelete);
        },
        open: toggleDelete
      }
      } />
      <div className='px-4'>
        <div className='px-6 mt-8 border rounded-lg border-white/10'>
          <div className='py-6'>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text text-md">Type a search, followed by the enter key</span>
              </div>
              <input
                className="w-full text-sm input input-bordered sm:text-base"
                type="text"
                placeholder="search by first name, last name, or email"
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
            </label>
          </div>
          <table className='table px-3'>
            <thead>
              <tr>
                {[
                  { title: 'Name/Email', className: 'text-base text-white/70' },
                  { title: 'Printing', className: 'text-base text-white/70 hidden md:flex justify-center' },
                  { title: 'Verified', className: 'text-base text-white/70 text-center' },
                  { title: 'Membership', className: 'text-base text-white/70 hidden sm:flex justify-center' },
                  { title: 'Delete', className: 'text-base text-white/70 text-center' },
                ].map(({ title, className }) => {
                  return (<th
                    className={`${className}`}
                    key={title}
                  >
                    {title}
                  </th>);
                })}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr className='break-all !rounded md:break-keep hover:bg-white/10' key={user.email}>
                    <td className=''>
                      <a className='link link-hover link-info' target="_blank" rel="noopener noreferrer" href={`/user/edit/${user._id}`}>
                        {formatFirstAndLastName(user)}
                      </a>
                      <p>{user.email}</p>
                    </td>
                    <td className='h-[65px] hidden mx-auto md:flex justify-center items-center'>{user.pagesPrinted}/30</td>
                    <td className=''>
                      <div className='flex items-center justify-center'>
                        {mark(user.emailVerified)}
                      </div>
                    </td>
                    <td className='items-center justify-center hidden break-keep sm:flex'>
                      {enums.membershipStateToString(user.accessLevel)}
                    </td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <button
                          className='p-2 hover:bg-white/30 rounded-xl'
                          onClick={() => {
                            setToggleDelete(!toggleDelete);
                            setUserToDelete(user);
                          }}
                        >
                          {svg.trashcanSymbol()}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {maybeRenderPagination()}
        </div>
      </div>
    </div>
  );
}
