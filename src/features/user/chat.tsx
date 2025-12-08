'use client';

import Script from 'next/script';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export {};

declare global {
  interface Window {
    tidioChatApi: {
      open: () => void;
      close: () => void;
      hide: () => void;
      show: () => void;
      display: (show: boolean) => void;
    };
  }
}

export default function TidioWidget() {
  const handleOpenChat = () => {
    if (window.tidioChatApi) {
      window.tidioChatApi.open();
    } else {
      console.warn('Tidio is not loaded yet');
    }
  };

  return (
    <>
      <Script
        src="//code.tidio.co/05hblgc0qsamnmve3czeijgqr8sj7yyt.js"
        strategy="lazyOnload"
      />

      {/* <Button
        onClick={handleOpenChat}
        variant="outline"
        className="gap-2"
      >
        <MessageCircle className="size-4" />
        Pomoc
      </Button> */}
    </>
  );
}
