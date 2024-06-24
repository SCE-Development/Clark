import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Background from '../../Components/Background/background';
import { validatePasswordReset, resetPassword } from '../../APIFunctions/Auth';

const ForgotPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState({
    color: null,
    message: ''
  });
  const searchParams = new URLSearchParams(useLocation().search);

  const checkValidPassword = () => {
    return (
      password &&
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    );
  };

  const invalidPasswordAlert = () => {
    if (!password) {
      return (
        submitted && (
          <p
            className='text-red-500'
          >Password cannot be left empty</p>
        )
      );
    }

    const lengthClass =
      (password.length >= 8 ? 'hidden' : 'text-red-500');
    const lowercaseClass =
      (/[a-z]/.test(password) ? 'hidden ' : 'text-red-500');
    const uppercaseClass =
      (/[A-Z]/.test(password) ? 'hidden' : 'text-red-500');
    const numberClass =
      (/\d/.test(password) ? 'hidden' : 'text-red-500');

    return (
      (
        <ul>
          <li id='passwordLengthRequirement' className={lengthClass}>
            8 or more characters
          </li>
          <li id='passwordLowercaseRequirement' className={lowercaseClass}>
            a lowercase letter
          </li>
          <li id='passwordUppercaseRequirement' className={uppercaseClass}>
            an uppercase letter
          </li>
          <li id='passwordNumberRequirement' className={numberClass}>
            a number 0-9
          </li>
        </ul>
      )
    );
  };

  async function handleSubmit(e) {
    setSubmitted(true);
    e.preventDefault();

    if (!checkValidPassword() || confirm !== password) {
      return;
    }

    const resetStatus = await resetPassword(password, searchParams.get('id'), searchParams.get('resetToken'));
    if (resetStatus.error) {
      setStatus({
        color: 'text-red-500',
        message: resetStatus.responseData.data.message || 'An error occurred. Please try again later.'
      });
    } else {
      setStatus({
        color: 'text-green-500',
        message: 'Your password has been reset.'
      });
    }
  }

  useEffect(() => {
    const validate = async () => {
      validatePasswordReset(searchParams.get('resetToken'))
        .then((res) => {
          if (res.error) {
            setStatus({
              color: 'text-red-500',
              message: res.responseData.data.message || 'An error occurred. Please try again later.'
            });
          }
        });
    };

    validate();
  }, []);

  return (
    <div className = 'flex-none md:flex'>
      <div className='rounded-3xl backdrop-blur-sm shadow-2xl md:w-1/3 mt-12 md:mt-20 pb-8 mb-auto mx-auto px-5 text-center items-center justify-center'>
        <div className='flex justify-center'>
          <img id='img' alt='sce logo' src='https://sce.sjsu.edu/images/SCE-glow.png' width='2rem' className='w-2/3 px-auto'/>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col items-center'>

          <label className="form-control w-full max-w-xs mt-2">
            <div className="label">
              <span className="label-text">New Password</span>
            </div>
            <input type="password" placeholder="New password" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)}/>
          </label>
          {invalidPasswordAlert()}

          <label className="form-control w-full max-w-xs mt-2">
            <div className="label">
              <span className="label-text">Confirm Password</span>
            </div>
            <input type="password" placeholder="Confirm password" className="input input-bordered w-full max-w-xs" onChange={(e) => setConfirm(e.target.value)}/>
          </label>
          {submitted && confirm !== password && <p className='text-red-500'>Passwords do not match</p>}

          {status.message && <p className={`${status.color}` + ' mt-5'}>{status.message}</p>}

          <button type='submit' disabled={status.message.includes('expired reset token')} className='btn w-full max-w-xs mt-5' onClick={(e) => handleSubmit(e)}>
            Reset Password
          </button>
        </form>
      </div>
      <Background />
    </div>
  );
};

export default ForgotPassword;
