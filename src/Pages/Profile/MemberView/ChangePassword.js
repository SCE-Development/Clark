import React, { useState } from 'react';
import { Input, Button, Modal, ModalFooter } from 'reactstrap';
import './profile-modifier.css';

import { editUser } from '../../../APIFunctions/User';



export default function ChangePassword(props) {
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('Confirming New Password');
  const [toggle, setToggle] = useState(true);

  async function changePassword() {


    if (password === confirmPass) {
      const apiResponse = await editUser(
        {
          ...props.user,
          password
        },
        props.user.token
      );

      if (!apiResponse.error) {
        setPassword('');
        window.alert('Success!!');
      }
    }
  }

  function buttonStyle() {
    let style = { marginTop: '10px' };
    password === confirmPass
      ? (style = {
        ...style,
        color: 'white'
      })
      : (style = {
        ...style,
        color: '#333333',
        cursor: 'not-allowed'
      });
    return style;
  }

  return (
    <div id="password-div">
      <Modal isOpen={toggle}>
        <h4 id="inner-text-top" style={{ marginTop: '10px' }}>
          <span className="password-span">
            <b>New Password: </b>
          </span>
          <Input
            id="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
        </h4>
        <h4 id="inner-text-top">
          <span className="password-span">
            <b>Confirm Password: </b>
          </span>
          <Input
            id="confirm-password"
            onChange={(e) => {
              setConfirmPass(e.target.value);
            }}
            type="password"
          />
        </h4>

        <ModalFooter>
          <Button
            id="change-password-button"
            color="info"
            style={
              (buttonStyle(),
              {
                background: '#0779e4',
                marginRight: '1rem',
                border: 'none',
                fontSize: '1.5rem',
                fontWeight: 'bolder'
              })
            }
            onClick={() => {
              changePassword();
            }}>
            Change Password
          </Button>
          <Button
            id="change-password-close-button"
            onClick={() => {
              setToggle(!toggle);
            }}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
