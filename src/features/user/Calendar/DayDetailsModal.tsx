'use client';

import * as React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from '@/components/ui/drawer';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface DayDetailsModalProps {
  day: Date;
  children: React.ReactNode; // This is the Calendar Cell Trigger
  content: React.ReactNode; // This is the <CalendarDayEvent /> list
  eventCount: number;
}

export function DayDetailsModal({
  day,
  children,
  content,
  eventCount,
}: DayDetailsModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const title = format(day, 'd LLLL yyyy', { locale: pl });
  const description = `${eventCount} wydarzeń tego dnia`;

  if (isDesktop) {
    return <div className="border-r last:border-r-0">{children}</div>;

    // <Popover
    //   open={open}
    //   onOpenChange={setOpen}
    // >
    //   <PopoverTrigger asChild>{children}</PopoverTrigger>
    //   <PopoverContent
    //     className="w-80"
    //     align="start"
    //   >
    //     <div className="bg-muted/50 border-b flex pb-4 justify-between items-center">
    //       <span className="font-semibold text-sm ">{title}</span>
    //       <span className="text-xs text-muted-foreground">{eventCount}</span>
    //     </div>
    //     {content}
    //   </PopoverContent>
    // </Popover>
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-8 max-h-[60vh] overflow-y-auto">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
