'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get('search') ?? '');
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const searchParams = new URLSearchParams(window.location.search);
    const currentQuery = searchParams.get('search');

    if (currentQuery !== null && !query) {
      searchParams.delete('search');
    } else {
      searchParams.set('search', query);
    }

    router.push(`?${searchParams.toString()}`);
  };

  return (
    <form
      className="inline-flex"
      onSubmit={handleSubmit}
    >
      <Input
        className="border-r-0 rounded-r-none"
        placeholder="Szukaj"
        name="search"
        defaultValue={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        type="submit"
        className="p-2 border border-primaryFg rounded-r-md"
      >
        <Search className="text-primaryFg h-4 w-4" />
      </button>
    </form>
  );
}
