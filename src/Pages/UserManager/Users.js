import React, { useState } from 'react';
import './UserManager.css';
import enums from '../../Enums';
const svg = require('./SVG');
import { deleteUserByEmail } from '../../APIFunctions/User';
import ConfirmationModal
  from '../../Components/DecisionModal/ConfirmationModal';
import { Modal } from 'reactstrap';
import InfoCard from '../Profile/admin/AdminView';

export const Users = ({ user }) => {

  const [toggle, setToggle] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const token = window.localStorage.getItem('jwtToken');
  async function deleteUser(user) {
    const deleteEmailResponse = await deleteUserByEmail(
      user.email,
      token
    );
    if (!deleteEmailResponse.error) {
      if (user.email === this.state.currentUser) {
        // logout
        window.localStorage.removeItem('jwtToken');
        window.location.reload();
        return window.alert('Self-deprecation is an art');
      }
    }
  }

  const confirmModalProps = {
    headerText: `Delete ${user.firstName} ${user.lastName} ?`,
    bodyText: `Are you sure you want to delete
    ${user.firstName}? They're kinda cute and
    they'll be gone forever if you do`,
    confirmText: `Yes, ${user.firstName} is dead to me`,
    cancelText: 'No, they\'re chill',
    toggle: () => setToggleDelete(!toggleDelete),
    handleConfirmation: () => {
      deleteUser(user);
      setToggleDelete(!toggleDelete);
      window.location.reload();
    },
    open: toggleDelete
  };

  function mark(bool) {
    return bool ? svg.checkMark() : svg.xMark();
  }

  return (
    <tr>
      <td id='user-manager-name'>{user.firstName} {user.lastName}</td>
      <td>{user.doorCode}</td>
      <td>{user.pagesPrinted}/30</td>
      <td>{mark(user.emailVerified)}</td>
      <td>{enums.membershipStateToString(user.accessLevel)}</td>
      <td><button
        className='overview-icon'
        onClick={() => {
          setToggleDelete(!toggleDelete);
        }}
      >
        {svg.trashcanSymbol()}
      </button></td>
      <td>
        <button
          className='overview-icon'
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          {svg.editSymbol()}
        </button>
      </td>
      <Modal
        isOpen={toggle}
        toggle={() => {
          setToggle(!toggle);
        }}
      >
        {svg.cancelEditSymbol(() => {
          setToggle(!toggle);
        })}
        <InfoCard user={user} token={token} />
      </Modal>
      <ConfirmationModal {...confirmModalProps} />
    </tr>
  );
};
