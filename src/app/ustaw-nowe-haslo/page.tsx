import { updatePassword } from '@/server/actions/auth';
import Image from 'next/image';

const SetNewPassword = () => {
  return (
    <section>
      <div className="grid lg:grid-cols-2">
        <form className="flex flex-col gap-4 max-w-md mx-auto mt-10">
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            name="password"
            placeholder="New password"
            className="border p-2 rounded"
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            className="border p-2 rounded"
            required
          />
          <button
            formAction={updatePassword}
            className="bg-green-600 text-white p-2 rounded"
          >
            Update Password
          </button>
        </form>
        <Image
          className="auth-hero-image object-cover object-bottom w-full hidden lg:block"
          src="https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/website-assets/images/hero.png"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
};

export default SetNewPassword;
