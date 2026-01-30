import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  deleteUser,
  addUser,
} from '../../APIFunctions/LeetCodeLeaderboard.js';
import { trashcanSymbol } from '../Overview/SVG.js';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal.js';
import { useSCE } from '../../Components/context/SceContext.js';

const SIGN2_URL = process.env.REACT_APP_SIGN2_URL || 'http://192.168.69.180:8888';

export default function LeetCodeLeaderboard() {
  const { user } = useSCE();
  const token = user.token;

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [confirmLeetcodeUsername, setConfirmLeetcodeUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  async function getAllRegisteredUsers() {
    const apiResponse = await getAllUsers(token);
    if (!apiResponse.error) {
      setRegisteredUsers(apiResponse.responseData.users);
    }
  }

  function handleDeleteClick(user) {
    setToggleDelete(!toggleDelete);
    setUserToDelete(user);
  }

  function resetInputFields() {
    setFirstName('');
    setLastName('');
    setLeetcodeUsername('');
    setConfirmLeetcodeUsername('');
  }

  async function handleRegisterUser(e) {
    e.preventDefault();
    const newUser = {
      username: leetcodeUsername,
      firstName,
      lastName
    };
    const tryAddUser = await addUser(newUser, token);
    if (tryAddUser.responseData.error) {
      setIsError(true);
      if (tryAddUser.responseData.statusCode && tryAddUser.responseData.statusCode === 409) {
        setMessage('This username is already registered, please try again');
        return;
      }
      setMessage('Error registering user, please try again later');
    } else {
      getAllRegisteredUsers();
    }
    resetInputFields();
  }

  useEffect(() => {
    getAllRegisteredUsers();
  }, []);

  useEffect(() => {
    setIsError(() => {
      if (leetcodeUsername.length === 0 || confirmLeetcodeUsername.length === 0) {
        setMessage('');
        setIsDisabled(true);
        return false;
      }
      if (leetcodeUsername !== confirmLeetcodeUsername) {
        setMessage('Usernames do not match.');
        setIsDisabled(true);
        return true;
      }
      setMessage('');
      setIsDisabled(false);
      return false;
    });
  }, [leetcodeUsername, confirmLeetcodeUsername]);

  return (
    <div className='text-center overview-container bg-gray min-h-[100dvh]'>
      <h1 className='text-gray-700 dark:text-white text-4xl font-bold py-4'>
        SCE LeetCode Leaderboard
      </h1>
      <pre className='text-gray-700 dark:text-white text-lg'>This page manages the functions of the LeetCode Leaderboard</pre>
      <div className='flex flex-col items-center text-black dark:text-white'>
        <h1 className='text-gray-700 dark:text-white text-2xl font-bold py-4'>
          LeetCode Leaderboard
        </h1>
        <ConfirmationModal {... {
          headerText: `Remove ${userToDelete.username}?`,
          bodyText: `Are you sure you want to remove ${userToDelete.firstName} ${userToDelete.lastName} from the leaderboard? 
          They'll be gone forever if you do.`,
          confirmText: `Yes, remove ${userToDelete.username}`,
          cancelText: 'No, they\'re chill',
          confirmClassAddons: 'bg-red-600 hover:bg-red-500',
          handleConfirmation: async () => {
            await deleteUser(userToDelete.username, token);
            await getAllRegisteredUsers();
            setToggleDelete(!toggleDelete);
          },
          handleCancel: () => setToggleDelete(!toggleDelete),
          open: toggleDelete
        }
        } />
        <div className='max-w-full flex flex-col justify-center items-center'>
          <div className='max-w-[1150px] max-h-[1150px] overflow-hidden inline-block scale-50 origin-top border-[6px] border-red-500 dark:border-white' style={{ marginBottom: '-500px' }}>
            <iframe
              id='led-frame'
              src={SIGN2_URL}
              title='LED Emulator'
              className='w-[1150px] h-[1150px]'
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
                  <p className={`text-sm min-h-[1.25rem] ${isError ? 'text-red-500' : ''}`}>{message}</p>
                </div>
              </form>
            </div>
            <div className='overflow-x-auto overflow-y-auto mb-12'>
              <table className='w-full min-w-full text-gray-700 dark:text-gray-400 table-auto border-collapse'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    {[
                      { title: 'First Name', id: 'fn' },
                      { title: 'Last Name', id: 'ln' },
                      { title: 'LeetCode Username', id: 'lcu' },
                      { title: '', id: 'del' }
                    ].map(({ title, id }) => (
                      <th key={id} className='px-6 py-3 whitespace-nowrap'>
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
                      <td className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
                        <div className='h-[2rem] leading-[2rem] px-2 border border-transparent rounded-md'>
                          {user.firstName}
                        </div>
                      </td>
                      <td className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
                        <div className='h-[2rem] leading-[2rem] px-2 border border-transparent rounded-md'>
                          {user.lastName}
                        </div>
                      </td>
                      <td className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-white'>
                        <div className='h-[2rem] leading-[2rem] px-2 border border-transparent rounded-md'>
                          {user.username}
                        </div>
                      </td>
                      <td>
                        <button
                          className='p-2 hover:bg-gray-200 dark:hover:bg-white/30 rounded-xl cursor-pointer'
                          onClick={() => handleDeleteClick(user)}
                        >
                          {trashcanSymbol('#e64539')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
