'use client';

import { BadgeHelp, ChevronDown } from 'lucide-react';
import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  type SetStateAction,
  type Dispatch,
  type RefObject,
} from 'react';
import { cn } from '@/lib/utils';

interface FaqContextType {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  height: number | undefined;
  collapsibleContentRef: RefObject<HTMLDivElement | null>;
}

const FaqContext = createContext<FaqContextType | null>(null);

const useFaqContext = () => {
  const context = useContext(FaqContext);

  if (!context) {
    console.error('Faq components must be used within FaqItem provider!');
    throw new Error('Faq components must be used within FaqItem provider!');
  }

  return context;
};

export function FaqItem({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height, setHeight] = useState<number>();
  const collapsibleContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureHeight = () => {
      if (collapsibleContentRef.current) {
        setHeight(collapsibleContentRef.current.scrollHeight);
      }
    };
    measureHeight();

    window.addEventListener('resize', measureHeight);

    return () => {
      window.removeEventListener('resize', measureHeight);
    };
  }, []);

  return (
    <FaqContext.Provider
      value={{ isCollapsed, setIsCollapsed, height, collapsibleContentRef }}
    >
      <div className="bg-whiteBg rounded-lg overflow-hidden">{children}</div>
    </FaqContext.Provider>
  );
}

export function FaqQuestion({ children }: { children: ReactNode }) {
  const { isCollapsed, setIsCollapsed } = useFaqContext();

  return (
    <div
      className="p-4 flex items-center gap-4 cursor-pointer"
      onClick={() => setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed)}
    >
      <BadgeHelp className="text-primaryFg" />
      {children}
      <ChevronDown
        className={cn(
          !isCollapsed && 'transform -rotate-180',
          'text-primaryFg duration-300',
          'ml-auto'
        )}
      />
    </div>
  );
}

export function FaqAnswer({ children }: { children: ReactNode }) {
  const { collapsibleContentRef, isCollapsed, height } = useFaqContext();

  return (
    <div
      ref={collapsibleContentRef}
      style={{
        maxHeight: isCollapsed ? 0 : `${height}px`,
        transitionProperty: 'max-height',
        transitionDuration: '0.3s',
      }}
    >
      <div className="bg-whiteBg rounded-b-lg border-t border-primaryFg px-14 py-4">
        {children}
      </div>
    </div>
  );
}
