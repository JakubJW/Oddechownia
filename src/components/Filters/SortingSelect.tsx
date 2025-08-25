'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SortingSelectProps {
  name: string;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
}

export default function SortingSelect({
  options,
  name,
  placeholder,
}: SortingSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(
    new URLSearchParams(window.location.search).get(name) ?? undefined
  );

  const handleValueChange = (value: string) => {
    setValue(value);
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set(name, value);

    router.push(`?${searchParams.toString()}`);
  };

  return (
    <Select
      name={name}
      onValueChange={(value) => handleValueChange(value)}
      defaultValue={value}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value }, index) => (
          <SelectItem
            key={index}
            value={value}
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
