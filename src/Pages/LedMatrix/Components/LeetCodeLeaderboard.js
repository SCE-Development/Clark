import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, addUser, updateUser } from '../../../APIFunctions/LedMatrix.js';
import { trashcanSymbol } from '../../Overview/SVG.js';
import ConfirmationModal from '../../../Components/DecisionModal/ConfirmationModal';

export default function LeetCodeLeaderboard({ token }) {

  const [registeredUsers, setRegisteredUsers] = useState([
    {
      firstName: 'Nathan',
      lastName: 'Tran',
      username: 'vnate',
    },
    {
      firstName: 'Oliver',
      lastName: 'Majano',
      username: 'ioliver678',
    },
    {
      firstName: 'Martin',
      lastName: 'Ceballos',
      username: 'mceballos123',
    }
  ]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [userToEdit, setUserToEdit] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [confirmLeetcodeUsername, setConfirmLeetcodeUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isMatching, setIsMatching] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  // fetch the list of registered users
  async function getAllRegisteredUsers() {
    const apiResponse = await getAllUsers({ token });
    if (!apiResponse.error) {
      setRegisteredUsers(apiResponse.responseData.users);
    }
  }

  function handleDeleteClick(user) {
    setToggleDelete(!toggleDelete);
    setUserToDelete(user);
  }

  function handleEditClick(user) {
    setUserToEdit(user);
  }

  async function handleUpdateUser(user) {
    /*
    const newFirstName = document.querySelector(
      `input[placeholder="${user.firstName}]`
    ).value;
    const newLastName = document.querySelector(
      `input[placeholder="${user.lastName}]`
    ).value;
    const newUsername = document.querySelector(
      `input[placeholder="${user.username}]`
    ).value;
    const newUser = {
      firstName: newFirstName,
      lastName: newLastName,
      username: newUsername
    };
    if (!await updateUser(user, newUser, token)) {
      setMessage('Error updating user');
    } else {
      getAllRegisteredUsers();
    }
    */
    setUserToEdit(null);
  }

  function resetInputFields() {
    setFirstName('');
    setLastName('');
    setLeetcodeUsername('');
    setConfirmLeetcodeUsername('');
  }

  async function handleRegisterUser(e) {
    e.preventDefault();
    const userData = {
      username: leetcodeUsername,
      firstName,
      lastName,
    };
    // add a check for this user already existing -> setMessage for this too
    setRegisteredUsers([...registeredUsers, userData]);
    resetInputFields();
    /*
    if (!await addUser(userData, token)) {
      setMessage('Error registering user');
    } else {
      getAllRegisteredUsers();
    }
    */
  }

  useEffect(() => {
    getAllRegisteredUsers();
  }, []);

  useEffect(() => {
    setIsMatching(() => {
      if (leetcodeUsername.length === 0 || confirmLeetcodeUsername.length === 0) {
        setMessage('');
        setIsDisabled(true);
        return true;
      }
      if (leetcodeUsername !== confirmLeetcodeUsername) {
        setMessage('Usernames do not match.');
        setIsDisabled(true);
        return false;
      }
      setMessage('');
      setIsDisabled(false);
      return true;
    });
  }, [leetcodeUsername, confirmLeetcodeUsername]);

  return (
    <div className='flex flex-col items-center text-black dark:text-white'>
      <h1 className='text-gray-700 dark:text-white text-2xl font-bold py-4'>
        LeetCode Leaderboard
      </h1>
      <ConfirmationModal {... {
        headerText: `Remove ${userToDelete.username}?`,
        bodyText: `Are you sure you want to remove ${userToDelete.name} from the leaderboard? 
          They'll be gone forever if you do.`,
        confirmText: `Yes, remove ${userToDelete.username}`,
        cancelText: 'No, keep them',
        confirmClassAddons: 'bg-red-600 hover:bg-red-500',
        handleConfirmation: async () => {
          await deleteUser(userToDelete, token);
          await getAllRegisteredUsers();
          setToggleDelete(!toggleDelete);
        },
        open: toggleDelete
      }
      } />
      <div className='max-w-full flex flex-col justify-center items-center'>
        <div className='max-w-[1150px] max-h-[700px] overflow-hidden inline-block scale-50 origin-top border-[6px] border-red-500 dark:border-white'>
          <iframe
            id='led-frame'
            src='http://192.168.69.123:8888'
            title='LED Emulator'
            className='w-[1150px] h-[700px]'
            scrolling='no'
          />
        </div>
      </div>
      <div className='w-full px-8'>
        <h3 className='text-gray-700 dark:text-white text-lg font-bold'>Registered Users</h3>
        <div className='flex flex-col'>
          <div className='my-6'>
            <span className='label-text text-md'>Enter a user's details here to register them for the LeetCode Leaderboard!</span>
            <form onSubmit={handleRegisterUser}>
              <div className='flex flex-row items-center pt-6 pb-4 space-x-2'>
                <input
                  type='text'
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='flex-1 text-sm input input-bordered sm:text-base'
                />
                <input
                  type='text'
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='flex-1 text-sm input input-bordered sm:text-base'
                />
                <input
                  type='text'
                  placeholder='LeetCode username'
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  className='flex-1 text-sm input input-bordered sm:text-base'
                />
                <input
                  type='text'
                  placeholder='Confirm username'
                  value={confirmLeetcodeUsername}
                  onChange={(e) => setConfirmLeetcodeUsername(e.target.value)}
                  className='flex-1 text-sm input input-bordered sm:text-base'
                />
                <button
                  className={`text-sm btn btn-primary sm:text-base hover:text-white flex-grow-0 ${isDisabled ? 'cursor-not-allowed pointer-events-none bg-gray-400' : ''}`}
                  type='submit'
                >
                  Register
                </button>
              </div>
              <div className='pb-4'>
                <p className={`text-sm min-h-[1.25rem] ${isMatching ? '' : 'text-red-500'}`}>{message}</p>
              </div>
            </form>
          </div>
          <div className='overflow-x-auto overflow-y-auto mb-12'>
            <table className='w-full min-w-full text-gray-700 dark:text-gray-400 table-auto border-collapse'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  {[
                    { title: 'First Name' },
                    { title: 'Last Name' },
                    { title: 'LeetCode Username' },
                    { title: '', },
                    { title: '', }
                  ].map(({ title, index }) => (
                    <th key={index}
                      className='px-6 py-3 whitespace-nowrap'
                    >
                      <div className='flex items-center justify-center'>
                        {title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='text-center text-sm'>
                {registeredUsers.map((user, index) => (
                  <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <td className='px-2 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
                      {user === userToEdit ? (
                        <input
                          type='text'
                          defaultValue={user.firstName}
                          placeholder={user.firstName}
                          className='dark:bg-gray-200 dark:text-black border border-[#555] rounded-md h-[2rem] leading-[2rem] px-2'
                        />
                      ) : (
                        <div className='h-[2rem] leading-[2rem] px-2 border border-transparent rounded-md'>
                          {user.firstName}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
                      {user === userToEdit ? (
                        <input
                          type='text'
                          defaultValue={user.lastName}
                          placeholder={user.lastName}
                          className='dark:bg-gray-200 dark:text-black border border-[#555] rounded-md h-[2rem] leading-[2rem] px-2'
                        />
                      ) : (
                        <div className='h-[2rem] leading-[2rem] px-2 border border-transparent rounded-md'>
                          {user.lastName}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
                      {user === userToEdit ? (
                        <input
                          type='text'
                          defaultValue={user.username}
                          placeholder={user.username}
                          className='dark:bg-gray-200 dark:text-black border border-[#555] rounded-md h-[2rem] leading-[2rem] px-2'
                        />
                      ) : (
                        <div className='h-[2rem] leading-[2rem] px-2 border border-transparent rounded-md'>
                          {user.username}
                        </div>
                      )}
                    </td>
                    <td>
                      {user === userToEdit ? (
                        <button
                          className='h-[2rem] px-3 bg-blue-400 hover:text-white hover:bg-blue-600 rounded-xl text-black cursor-pointer transition-all duration-300 ease-in-out'
                          onClick={() => handleUpdateUser(user)}
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          className='h-[2rem] px-3 bg-blue-400 hover:text-white hover:bg-blue-600 rounded-xl text-black cursor-pointer transition-all duration-300 ease-in-out'
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      {user === userToEdit ? (
                        <button
                          className='h-[2rem] px-3 bg-red-500 hover:text-white hover:bg-red-600 rounded-xl text-black cursor-pointer'
                          onClick={() => setUserToEdit(null)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          className='p-2 hover:bg-gray-200 dark:hover:bg-white/30 rounded-xl cursor-pointer'
                          onClick={() => handleDeleteClick(user)}
                        >
                          {trashcanSymbol('#e64539')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
