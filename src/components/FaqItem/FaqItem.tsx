'use-client';

import { BadgeHelp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FaqItemProps {
  question: string;
  answer: string;
}

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="p-4 bg-whiteBg rounded-lg overflow-hidden">
      <div className="flex items-center gap-4">
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
        className={cn('transition-clip -mx-4 duration-300 ease-in-out', collapsed ? 'collapsible__collapsed' : 'collapsible__expanded')}
      >
        <div className="bg-whiteBg rounded-b-lg border-t border-primaryFg pt-4 mt-4 px-14">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
