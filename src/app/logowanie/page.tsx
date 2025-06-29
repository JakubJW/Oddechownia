import LoginForm from '@/features/Login/Form/LoginForm';
import Image from 'next/image';

export default function Login() {
  return (
    <section>
      <div className="grid lg:grid-cols-2">
        <LoginForm />
        <Image
          className="homepage-hero-image object-cover object-bottom w-full hidden lg:block"
          src="https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/website-assets/images/hero.png"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
}
