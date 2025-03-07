import LoginForm from '@/features/Login/Form/LoginForm';
import Image from 'next/image';

export default function Login() {
  return (
    <section>
      <div className="grid lg:grid-cols-2">
        <LoginForm />
        <Image
          className="homepage-hero-image object-cover w-full hidden lg:block"
          src="https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg"
          alt="Hero image"
          height={1365}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
}
