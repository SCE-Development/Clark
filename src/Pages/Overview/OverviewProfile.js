import React, { useState } from 'react';
import './Overview.css';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
import { Link } from 'react-router-dom';
const enums = require('../../Enums.js');
const svg = require('./SVG');

export default function OverviewProfile(props) {
  const [toggleDelete, setToggleDelete] = useState(false);

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
            setToggleDelete(!toggleDelete);
          }}
        >
          {svg.trashcanSymbol()}
        </button>
      </td>

      <td>
        <Link target='_blank' to={`/user/edit/${props.user._id}`}>
          <button
            className='overview-icon'
          >
            {svg.editSymbol()}
          </button>
        </Link>
      </td>
    </tr>
  );
}
