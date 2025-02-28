import React from 'react';
import Navigation from './Navigation/Navigation';
import Footer from './Footer/Footer';

export default function Layout({ children }: React.PropsWithChildren<object>) {
  return (
    <>
      <Navigation />
      <main className="mt-[64px] sm:mt-[76px]">{children}</main>
      <Footer />
    </>
  );
}
