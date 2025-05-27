'use client';

import { Button } from '../ui/button';

interface PurchaseCourseButtonProps {
  text: string;
  endpoint: string;
  payload: { [key: string]: any };
}

export default function PurchaseCourseButton({
  text,
  endpoint,
  payload
}: PurchaseCourseButtonProps) {
  return (
    <Button
      variant="outline"
      className="text-almond bg-richBlack border-richBlack"
      size="lg"
      onClick={async () => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const { url } = await res.json();
        console.log(url);
        window.location.href = url;
      }}
    >
      {text}
    </Button>
  );
}
