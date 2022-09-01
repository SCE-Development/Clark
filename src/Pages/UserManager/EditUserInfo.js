import React, { useState, useEffect } from 'react';
import
{ getUserById,
  editUser,
  deleteUserByEmail
} from '../../APIFunctions/User';
import Header from '../../Components/Header/Header';
import Popup from './Popup';
import { Button } from 'reactstrap';
import './EditUserInfoCSS.css';

export default function EditUserInfo(props) {
  const ID = props.match.params.id;
  const token = props.user.token;

  const [ email, setEmail ] = useState('');
  const [ chosenUser, setChosenUser ] = useState([]);
  const [ isFinishedFetching, setIsFinishedFetching ] = useState(false);
  const [ triggerSaveButton, setTriggerSaveButton ] = useState(false);
  const [ saveBtnText, setSaveBtnText ] = useState('Save');
  const [ triggerDeleteBtn, setTriggerDeleteBtn ] = useState(false);
  const [ popUpText, setPopupText ] =
    useState('Are you sure you want to delete this user?');

  useEffect( () => {
    async function getUser() {
      const user = await getUserById(ID, token);
      setChosenUser(user.responseData);
      setIsFinishedFetching(true);
      setEmail(user.responseData.email);
    }
    getUser();
  }, []);

  function handleInputChange(e) {
    setTriggerSaveButton(true);
    let { name, value } = e.target;
    switch (value){
    case 'BANNED':
      value = -2;
      break;
    case 'PENDING':
      value = -1;
      break;
    case 'NON_MEMBER':
      value = 0;
      break;
    case 'ALUMNI':
      value = 0.5;
      break;
    case 'MEMBER':
      value = 1;
      break;
    case 'OFFICER':
      value = 2;
      break;
    case 'ADMIN':
      value = 3;
      break;
    }
    setChosenUser((prev) => {
      const updateField = {
        ...prev,
        [name]: value
      };
      return updateField;
    });
  }

  function deleteButtonClicked(){
    setTriggerDeleteBtn(true);
  }

  async function deleteUser(){
    const result = deleteUserByEmail( email, token);
    if(!result.error){
      setPopupText('The user is deleted! Please navigate to the previous tab!');
    }
  }

  function handleSubmitEdit(e){
    e.preventDefault();
    async function submitEditToDB(){
      await editUser(chosenUser, token);
    }
    submitEditToDB();
    setSaveBtnText('Saved');
  }

  return (
    <div>
      <Header title='Edit User Information' />
      {isFinishedFetching && (
        <form className='main-div' onSubmit={handleSubmitEdit}>
          <label htmlFor='firstName' className='label-text'>First name</label>
          <input
            type='text'
            name='firstName'
            id='input-box'
            value={chosenUser.firstName}
            onChange={handleInputChange}
          />

          <label htmlFor='lastName' className='label-text'>Last name</label>
          <input
            type='text'
            name='lastName'
            id='input-box'
            value={chosenUser.lastName}
            onChange={handleInputChange}
          />

          <label htmlFor='password' className='label-text'>Password</label>
          <input
            type='text'
            name='password'
            id='input-box'
            value={chosenUser.password}
            onChange={handleInputChange}
          />

          <label htmlFor='major' className='label-text'>Major</label>
          <input
            type='text'
            name='major'
            id='input-box'
            placeholder={chosenUser.major}
            onChange={handleInputChange}
          />

          <label htmlFor='accessLevel' className='label-text'>SCE's role</label>
          <select
            name='accessLevel'
            id='input-box'
            style ={{cursor: 'pointer'}}
            onChange={handleInputChange}
          >
            <option value=''>Choose your role</option>
            <option value='BANNED'>BANNED</option>
            <option value='PENDING'>PENDING</option>
            <option value='NON-MEMBER'>NON-MEMBER</option>
            <option value='ALUMNI'>ALUMNI</option>
            <option value='MEMBER'>MEMBER</option>
            <option value='OFFICER'>OFFICER</option>
            <option value='ADMIN'>ADMIN</option>
          </select>

          <label htmlFor='doorcode' className='label-text'>Doorcode</label>
          <input
            type='text'
            name='doorcode'
            id='input-box'
            value={chosenUser.doorcode}
            onChange={handleInputChange}
          />

          <div className='button-div'>
            {triggerSaveButton &&
              <Button
                outline
                color='primary'
                type='submit'
                className='save-button btn'>
                {saveBtnText}
              </Button>
            }
            <Button
              color='secondary'
              type='button'
              className='delete-button btn'
              onClick={deleteButtonClicked}>
              Delete
            </Button>
            <Popup
              trigger={triggerDeleteBtn}
              setTrigger={setTriggerDeleteBtn}
              deleteUser={deleteUser}>
              <h4>{popUpText}</h4>
            </Popup>
          </div>
        </form>
      )}
    </div>
  );
}
