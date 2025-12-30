'use client';

import Script from 'next/script';

export default function TidioWidget() {
  return (
    <Script
      src="//code.tidio.co/05hblgc0qsamnmve3czeijgqr8sj7yyt.js"
      strategy="lazyOnload"
    />
  );
}
