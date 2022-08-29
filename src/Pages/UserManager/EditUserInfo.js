import React, { useState, useEffect } from 'react';
import { getUserById } from '../../APIFunctions/User';
import Header from '../../Components/Header/Header';
import { Button } from 'reactstrap';
import './EditUserInfoCSS.css';

export default function EditUserInfo(props) {
  const ID = props.match.params.id;
  const token = props.user.token;
  const [chosenUser, setChosenUser] = useState([]);
  const [isFinishedFetching, setIsFinishedFetching] = useState(false);

  useEffect( () => {
    async function getUser() {
      const user = await getUserById(ID, token);
      setChosenUser(user.responseData);
      setIsFinishedFetching(true);
    }
    getUser();
  }, []);

  return (
    <div>
      <Header title='Edit User Information' />
      {isFinishedFetching && (
        <div className='main-div'>
          <label htmlFor='first-name' className='label-text'>First name</label>
          <input
            type='text'
            name='first-name'
            id='input-box'
            placeholder={chosenUser.firstName}/>

          <label htmlFor='last-name' className='label-text'>Last name</label>
          <input
            type='text'
            name='last-name'
            id='input-box'
            placeholder={chosenUser.lastName}/>

          <label htmlFor='password' className='label-text'>Password</label>
          <input
            type='text'
            name='password'
            id='input-box'
            placeholder={chosenUser.password}/>

          <label htmlFor='doorcode' className='label-text'>Doorcode</label>
          <input
            type='text'
            name='doorcode'
            id='input-box'
            placeholder={chosenUser.doorcode}/>
          <div className='button-div'>
            <Button
              outline
              active
              color='primary'
              type='submit'
              className='edit-button btn'>
                Edit
            </Button>
            <Button
              outline
              color='secondary'
              type='submit'
              className='cancel-button btn'>
            Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
