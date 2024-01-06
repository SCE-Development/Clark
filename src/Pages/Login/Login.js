import React, { useState } from 'react';
import { loginUser } from '../../APIFunctions/Auth';
import Background from '../../Components/Background/background';

export default function Login(props) {
  const queryParams = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fields = [
    {
      type: 'email',
      placeholder: 'Email',
      handleChange: (e) => setEmail(e.target.value),
    },
    {
      type: 'password',
      placeholder: 'Password',
      handleChange: (e) => setPassword(e.target.value),
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const loginStatus = await loginUser(email, password);
    if (!loginStatus.error) {
      props.setAuthenticated(true);
      window.localStorage.setItem('jwtToken', loginStatus.token);
      if (queryParams.get('redirect')) {
        window.location.href = queryParams.get('redirect');
      } else {
        window.location.reload();
      }
    } else {
      if(loginStatus.responseData === undefined || loginStatus.responseData.data.message === undefined){
        setErrorMsg('Backend May Be down, check with dev team!');
      }else{
        setErrorMsg(
          loginStatus.responseData && loginStatus.responseData.data.message
        );
      }
    }
  }

  return (
    <div className='flex-col flex-initial min-h-[calc(100vh-86px)]'>
      <div className='flex-none m-auto'>
        <div className='items-center justify-center p-8 mx-auto mt-auto text-center shadow-2xl rounded-3xl backdrop-blur-sm max-h-[1184px] max-w-xl'>
          <img id='img' alt='sce logo' src='https://sce.sjsu.edu/images/SCE-glow.png' className='flex mx-auto w-[50%]'/>
          {/* <div className='flex justify-center max-w-xl'>
          </div> */}
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col items-center'>
              <label className="w-full max-w-xs form-control">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input type="email" placeholder="Email" className="w-full max-w-xs input input-bordered" onChange={(e) => setEmail(e.target.value)}/>
              </label>
              <label className="w-full max-w-xs form-control">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input type="password" placeholder="Password" className="w-full max-w-xs input input-bordered" onChange={(e) => setPassword(e.target.value)}/>
              </label>
              {errorMsg && <p className='w-full max-w-xs pt-2 text-sm text-red-500 md:text-md'>{errorMsg}*</p>}
              <button type='submit' id='loginBtn' className='w-full max-w-xs mt-5 btn' onClick={(e) => handleSubmit(e)}>
                Login
              </button>
              <a className='w-full max-w-xs mt-5 btn' href='/register'>
                <button type='submit'>
                  Create an Account
                </button>
              </a>
            </div>
          </form>
        </div>
      </div>
      <Background />
    </div>
  );
}
