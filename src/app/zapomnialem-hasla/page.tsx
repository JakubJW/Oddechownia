import { ForgotPasswordForm } from '@/features/zapomnialem-hasla/form';
import Image from 'next/image';

const ForgotPassword = () => {
  return (
    <section>
      <div className="grid lg:grid-cols-2">
        <ForgotPasswordForm />
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

export default ForgotPassword;
