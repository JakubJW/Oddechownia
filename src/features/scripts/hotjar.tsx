'use client';

import Script from 'next/script';

export default function Hotjar() {
  return (
    <Script
      id="hotjar-init"
      strategy="afterInteractive"
      src="https://t.contentsquare.net/uxa/8b0850a3ee53b.js"
    />
  );
}
