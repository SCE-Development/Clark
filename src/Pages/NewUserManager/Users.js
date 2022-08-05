import React from 'react';
import './UserManager.css';
import enums from '../../Enums';
import { Table } from 'reactstrap';

export const Users = (data) => {

  return (
    <div>
      <h1>
        Users
      </h1>
      <h2>
        Name
      </h2>
      <h2>
        Wins
      </h2>
      <h2>
        Type
      </h2>
      <Table variant='dark'>
        <thead>
          <tr id='users-header'>
            {[
              'Name',
              'Door Code',
              'Printing',
              'Email Verified',
              'Membership Type',
              '',
              ''
            ].map((ele, ind) => {
              return <th key={ind}>{ele}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.data.map((key, index) => (
            // <div {...{ key: index }}>
            //   <div className='users'>
            //     {key.firstName} / /
            //     {enums.membershipStateToString(key.accessLevel)}
            //     / {key.pagesPrinted}/30
            //   </div>
            //   <br />
            // </div>
            <tr>
              <td>{key.firstName} {key.lastName}</td>
              <td>{key.doorCode}</td>
              <td>{key.pagesPrinted}/30</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
