import React, { useState, useEffect } from 'react';
import './Overview.css';
import { Modal } from 'reactstrap';
import InfoCard from '../Profile/admin/AdminView';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
import {
  getPersonsDoorCode,
  removePersonsDoorCode
} from '../../APIFunctions/DoorCode.js';
const enums = require('../../Enums.js');
const svg = require('./SVG');

export default function OverviewProfile(props) {
  const [toggle, setToggle] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [code, setDoorCode] = useState('');
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
      if(props.user.email != null)
        removePersonsDoorCode(props.user.email, props.token);
      setToggleDelete(!toggleDelete);
    },
    open: toggleDelete
  };

  function mark(bool) {
    return bool ? svg.checkMark() : svg.xMark();
  }

  function updateDoorCode(doorCode) {
    setDoorCode(doorCode);
  }

  useEffect(() => {
    setDoorCode('None Assigned');
    async function fetchDoorCode() {
      let data = await getPersonsDoorCode(props.user.email, props.token);
      if(!data.error){
        setDoorCode(data.responseData.doorCode.doorCode);
      }
    }
    fetchDoorCode();
  }, [props.user.email, props.token]);
  return (
    <tr>
      <td>
        <div className='name'>{formatFirstAndLastName(props.user)}</div>
      </td>

      <td>{ code }</td>

      <td>{props.user.pagesPrinted}/30</td>

      <td>{mark(props.user.emailVerified)}</td>

      <td>{enums.membershipStateToString(props.user.accessLevel)}</td>

      <td>
        <button
          className='overview-icon'
          onClick={() => {
            setToggleDelete(!toggleDelete);
          }}
        >
          {svg.trashcanSymbol()}
        </button>
      </td>

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
          props.updateQuery();
        }}
      >
        {svg.cancelEditSymbol(() => {
          props.updateQuery();
          setToggle(!toggle);
        })}
        <InfoCard updateUserState={props.updateUserState}
          users={props.users} user={props.user}
          token={props.token} doorCode={code}
          updateDoorCode={updateDoorCode}/>
      </Modal>

      <ConfirmationModal {...confirmModalProps} />
    </tr>
  );
}
