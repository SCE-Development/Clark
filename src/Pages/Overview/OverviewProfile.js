import React, { useState } from 'react';
import './Overview.css';
import { Modal } from 'reactstrap';
import InfoCard from '../Profile/admin/AdminView';
import ConfirmationModal from 
  '../../Components/DecisionModal/ConfirmationModal.js';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
const enums = require('../../Enums.js');
const svg = require('./SVG');

export default function OverviewProfile(props) {
  const [toggle, setToggle] = useState(false);
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
          className='delete'
          onClick={() => {
            setToggleDelete(!toggleDelete);
          }}
        >
          {svg.trashcanSymbol()}
        </button>
      </td>

      <td>
        <button
          className='delete'
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
          props.callDatabase();
          setToggle(!toggle);
          props.updateQuery();
        }}
      >
        {svg.cancelEditSymbol(props.callDatabase, () => {
          props.updateQuery();
          setToggle(!toggle);
        })}
        <InfoCard user={props.user} token={props.token} />
      </Modal>

      <ConfirmationModal {...confirmModalProps} />
    </tr>
  );
}
