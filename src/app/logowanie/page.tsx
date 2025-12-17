import LoginForm from '@/features/Login/Form/LoginForm';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  robots: 'noindex,nofollow',
};

export default function Login() {
  return (
    <section>
      <div className="grid lg:grid-cols-2">
        <LoginForm />
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
}
