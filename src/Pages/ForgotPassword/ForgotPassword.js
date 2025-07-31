import React, { useState } from 'react';
import { sendPasswordReset } from '../../APIFunctions/Mailer';
import GoogleRecaptcha from '../../Components/Captcha/GoogleRecaptcha';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaRef, setCaptchaRef] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setLoading(true);
    captchaRef.reset();
    const resetStatus = await sendPasswordReset(email, captchaValue);
    if (resetStatus.error) {
      setMessage(resetStatus.error?.response?.data?.message || 'An error occurred. Please try again later.');
    } else {
      setSubmitted(true);
      setMessage('A password reset email has been sent to you if your email exists in our system.');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100dvh-86px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="card bg-base-100 border border-white/10">
            <div className="card-body">
              <div className="text-center mb-6">
                <h2 className="card-title text-2xl font-bold justify-center">Reset your account</h2>
                <p className="text-base-content/70 text-sm mt-2">
                  Enter your email below to reset to your account
                </p>
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
                <button type='submit' disabled={loading || submitted} className='btn w-full max-w-xs mt-5' onClick={(e) => handleSubmit(e)}>
            Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
