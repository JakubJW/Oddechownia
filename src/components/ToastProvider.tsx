'use client';

import { Toaster } from './ui/sonner';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        richColors
        position="top-center"
      />
      {children}
    </>
  );
};

export default ToastProvider;
