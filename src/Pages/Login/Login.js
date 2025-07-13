import React from 'react';
import { LoginForm } from '../../Components/Login/LoginForm';

export default function Login() {
  return (
    <div className="flex min-h-[calc(100dvh-86px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
