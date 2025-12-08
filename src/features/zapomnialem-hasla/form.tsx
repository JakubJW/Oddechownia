'use client';

import { resetPassword } from '@/server/actions/auth';

export const ForgotPasswordForm = ({}) => {
  return (
    <form className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        className="border p-2 rounded"
        required
      />
      <button
        formAction={resetPassword}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Send Reset Link
      </button>
    </form>
  );
};
