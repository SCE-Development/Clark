import React, { useState } from 'react';
import './Overview.css';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
const enums = require('../../Enums.js');
const svg = require('./SVG');

export default function OverviewProfile(props) {
  const [toggleDelete, setToggleDelete] = useState(false);

  const confirmModalProps = {
    headerText: `Delete ${props.user.firstName} ${props.user.lastName} ?`,
    bodyText: `Are you sure you want to delete 
    ${props.user.firstName}? They're kinda cute and
    they'll be gone forever if you do`,
    confirmText: `Yes, ${props.user.firstName} is dead to me`,
    cancelText: 'No, they\'re chill',
    toggle: () => setToggleDelete(!toggleDelete),
    handleConfirmation: () => {
      props.deleteUser(props.user);
      setToggleDelete(!toggleDelete);
    },
    open: toggleDelete
  };

  function mark(bool) {
    return bool ? svg.checkMark() : svg.xMark();
  }
  return (
    <tr>
      <td>
        <div className='name'>{formatFirstAndLastName(props.user)}</div>
      </td>

      <td>{props.user.doorCode}</td>

      <td>{props.user.pagesPrinted}/30</td>

      <td>{mark(props.user.emailVerified)}</td>

      <td>{enums.membershipStateToString(props.user.accessLevel)}</td>

      <td>
        <button
          className='overview-icon'
          onClick={() => {
            console.log('bruh')
            setToggleDelete(!toggleDelete);
          }}
        >
          {svg.trashcanSymbol()}
        </button>
      </td>

      <td>
        <a target='_blank' href={`/user/edit/${props.user._id}`}>
          <button
            className='overview-icon'
          >
            {svg.editSymbol()}
          </button>
        </a>
      </td>
      <ConfirmationModal {...confirmModalProps} />
    </tr>
  );
}
