import React, { useState } from 'react';
import { loginUser } from '../../APIFunctions/Auth';
import { useAuth } from '../../Components/context/AuthContext';

export default function Login() {
  const { setAuthenticated } = useAuth();
  const queryParams = new URLSearchParams(window.location.search);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setErrorMsg('');
    const loginStatus = await loginUser(email, password);

    if (!loginStatus.error) {
      setAuthenticated(true);
      window.localStorage.setItem('jwtToken', loginStatus.token);
      if (queryParams.get('redirect')) {
        window.location.href = queryParams.get('redirect');
      } else {
        window.location.reload();
      }
    } else {
      const backendMsg = loginStatus?.responseData?.data?.message;
      if (backendMsg) {
        setErrorMsg(backendMsg);
      } else {
        setErrorMsg('Username or password did not match.');
      }
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-86px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="card bg-base-100 border border-white/10">
            <div className="card-body">
              <div className="text-center mb-6">
                <h2 className="card-title text-2xl font-bold justify-center">Login to your account</h2>
                <p className="text-base-content/70 text-sm mt-2">
                  Enter your email below to login to your account
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <label htmlFor="email" className="label">
                      <span className="label-text text-sm font-medium">Email</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <label htmlFor="password" className="label">
                        <span className="label-text text-sm font-medium">Password</span>
                      </label>
                      <a
                        href="/forgot"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="input input-bordered w-full"
                    />
                  </div>
                  {errorMsg && (
                    <div className="text-red-500 text-sm text-center">
                      {errorMsg}
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                    >
                      Login
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
