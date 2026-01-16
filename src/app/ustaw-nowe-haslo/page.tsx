import { SetNewPasswordForm } from '@/features/zapomnialem-hasla/set-new-password-form';
import Image from 'next/image';

const ForgotPassword = () => {
  return (
    <section>
      <div className="grid lg:grid-cols-2">
        <SetNewPasswordForm />
        <Image
          className="auth-hero-image object-cover object-bottom w-full hidden lg:block"
          src="/auth-hero.png"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
};

export default ForgotPassword;
