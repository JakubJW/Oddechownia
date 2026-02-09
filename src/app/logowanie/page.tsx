import Container from '@/components/Container/Container';
import LoginForm from '@/features/Login/Form/LoginForm';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Logowanie',
};

export default function Login() {
  return (
    <section>
      <Container className="min-h-screen grid lg:grid-cols-2 lg:gap-16">
        <LoginForm />
        <div className="relative hidden lg:block">
          <Image
            className="object-cover object-bottom rounded-[32px]"
            src="/auth-hero.png"
            alt="Hero image"
            fill
            priority={true}
          />
        </div>
      </Container>
    </section>
  );
}
