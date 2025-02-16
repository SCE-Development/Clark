import { useState } from 'react';

const MailchimpForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('empty');
      return;
    }
    const form = e.target;
    const formData = new FormData(form);
    try {
      await fetch(form.action, { method: 'POST', body: formData, mode: 'no-cors' });
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };
  return (
    <div className='w-full max-w-xs sm:max-w-md xl:max-w-lg flex flex-col space-y-2'>
      <p className='text-gray-700 dark:text-gray-300 text-sm font-medium'>
        Stay updated with our latest news and events. Subscribe now!
      </p>
      <form
        action='https://sjsu.us10.list-manage.com/subscribe/post?u=52fcd2d1a09327d04bb0cb9e6&id=9154d12e87&f_id=000b41e4f0'
        method='post'
        className='validate flex w-full items-center space-x-3'
        target='_blank'
        onSubmit={handleSubmit}
      >
        <input
          type='email'
          name='EMAIL'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus(null);
          }}
          className='border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-2.5 flex-1'
          placeholder='Enter your email'
          required
        />
        <button
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300'
        >
          Subscribe
        </button>
      </form>
      {status === 'success' && (
        <p className='text-green-600 text-sm font-semibold'>
          ✅ You're subscribed!
        </p>
      )}
      {status === 'error' && (<p className='text-red-600 text-sm font-semibold'>❌ Something went wrong. Please try again later.</p>)}
    </div>
  );
};

export default MailchimpForm;
