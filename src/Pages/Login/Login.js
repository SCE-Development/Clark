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
    <div className = 'flex-none md:flex  pt-4 '>
      <div className='rounded-3xl backdrop-blur-sm shadow-2xl md:w-1/3  mt-20 pb-4 mb-auto ml-auto mr-auto px-5 text-center items-center justify-center'>
        <div className='flex justify-center'>
          <img id='img' alt='sce logo' src='https://sce.sjsu.edu/images/SCE-glow.png' width='2rem'  className='w-2/3 px-auto'/>
        </div>
        <form onSubmit={handleSubmit} className=''>
          <div className='flex flex-col items-center'>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)}/>
            </label>
            {errorMsg && <p className='text-red-500 text-sm md:text-md pt-2 w-full max-w-xs'>{errorMsg}*</p>}
            <button type='submit' id='loginBtn' className='btn w-full max-w-xs mt-5' onClick={(e) => handleSubmit(e)}>
              Login
            </button>
            <a className='btn mt-5 w-full max-w-xs' href='/register'>
              <button type='submit'>
                Create an Account
              </button>
            </a>
          </div>
        </form>
      </div>
      <Background />
    </div>
  );
}
