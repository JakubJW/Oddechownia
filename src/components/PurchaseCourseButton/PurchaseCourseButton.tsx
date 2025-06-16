'use client';

import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface PurchaseCourseButtonProps {
  text: string;
  endpoint: string;
  payload: { [key: string]: unknown };
}

export default function PurchaseCourseButton({
  text,
  endpoint,
  payload,
}: PurchaseCourseButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="text-almond bg-richBlack border-richBlack"
      size="lg"
      onClick={async () => {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (res.status === 401) {
            return router.push('/dolacz-do-nas');
          }

          const { url } = await res.json();

          window.location.href = url;
        } catch (error) {
          console.error(error);
        }
      }}
    >
      {text}
    </Button>
  );
}
