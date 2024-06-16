import { useState } from 'react';
import { sendPasswordReset } from '../../APIFunctions/Mailer';
import Background from '../../Components/Background/background';
import GoogleRecaptcha from '../../Components/Captcha/GoogleRecaptcha';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaRef, setCaptchaRef] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (process.env.NODE_ENV === 'production' && !captchaValue) {
      setMessage('Please complete the reCAPTCHA.');
      return;
    }
    if (!(email.includes('@') && email.includes('.'))) {
      setMessage('Please enter a valid email address.');
      return;
    }

    captchaRef.reset();
    const resetStatus = await sendPasswordReset(email, captchaValue);
    if (resetStatus.error) {
      setMessage('An error occurred. Please try again later.');
    } else {
      setMessage('A password reset email has been sent to you if your email exists in our system.');
    }
  }

  return (
    <div className = 'flex-none md:flex'>
      <div className='rounded-3xl backdrop-blur-sm shadow-2xl md:w-1/3 mt-20 pb-4 mb-auto mx-auto px-5 text-center items-center justify-center'>
        <div className='flex justify-center'>
          <img id='img' alt='sce logo' src='https://sce.sjsu.edu/images/SCE-glow.png' width='2rem' className='w-2/3 px-auto'/>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col items-center'>
          <label className="form-control w-full max-w-xs mb-4">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)}/>
          </label>
          <div id='recaptcha'>
            <GoogleRecaptcha setCaptchaValue={setCaptchaValue} setCaptchaRef={setCaptchaRef}/>
          </div>
          {message && <p
            className={`${message.includes('email has been sent') ? 'text-green-500' : 'text-red-500'}` +
            ' text-sm md:text-md pt-2 w-full max-w-xs'}
          >{message}</p>}
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
