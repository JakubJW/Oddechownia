'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export const ExpandableText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongText = text.length > 150;

  return (
    <div>
      <p
        className={cn(
          'text-sm md:text-base text-gray-500 whitespace-pre-wrap leading-relaxed',
          !isExpanded && 'line-clamp-2'
        )}
      >
        {text}
      </p>
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium mt-1 text-primary hover:underline focus:outline-hidden"
        >
          {isExpanded ? 'Pokaż mniej' : 'Zobacz więcej'}
        </button>
      )}
    </div>
  );
};
