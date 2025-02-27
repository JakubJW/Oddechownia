'use-client';

import { BadgeHelp, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface FaqItemProps {
  question: string;
  answer: string;
}

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [height, setHeight] = useState<number>();
  const collapsibleContent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!collapsibleContent.current) return;
    setHeight(collapsibleContent.current.scrollHeight);

    const onResize = () => {
      if (!collapsibleContent.current) return;
     setHeight(collapsibleContent.current.scrollHeight);
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    }
  }, []);

  return (
    <div className="bg-whiteBg rounded-lg overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        <BadgeHelp className="text-primaryFg" />
        <p>{question}</p>
        <button
          className="ml-auto"
          onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
        >
          <ChevronDown
            className={cn(
              !collapsed && 'transform -rotate-180',
              'text-primaryFg duration-300'
            )}
          />
        </button>
      </div>
      <div
        ref={collapsibleContent}
        style={{
          maxHeight: collapsed ? 0 : `${height}px`,
          transitionProperty: 'max-height',
          transitionDuration: '0.3s',
        }}
      >
        <div className="bg-whiteBg rounded-b-lg border-t border-primaryFg px-14 py-4">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
