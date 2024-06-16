import { useState } from 'react';
import Background from '../../Components/Background/background';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('In development.');
  }

  return (
    <div className = 'flex-none md:flex'>
      <div className='rounded-3xl backdrop-blur-sm shadow-2xl md:w-1/3 mt-20 pb-4 mb-auto mx-auto px-5 text-center items-center justify-center'>
        <div className='flex justify-center'>
          <img id='img' alt='sce logo' src='https://sce.sjsu.edu/images/SCE-glow.png' width='2rem' className='w-2/3 px-auto'/>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col items-center'>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)}/>
          </label>
          {error && <p className='text-red-500 text-sm md:text-md pt-2 w-full max-w-xs'>{error}</p>}
          <button type='submit' className='btn w-full max-w-xs mt-5' onClick={(e) => handleSubmit(e)}>
            Reset Password
          </button>
        </form>
      </div>
      <Background />
    </div>
  );
};

export default ForgotPassword;
