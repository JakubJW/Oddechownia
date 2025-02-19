import React from 'react';
import Navigation from './Navigation/Navigation';

export default function Layout({ children }: React.PropsWithChildren<object>) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}
