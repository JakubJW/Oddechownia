'use client';

import { useMutation } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import { useState } from 'react';
import { queryClient } from '@/components/QueryClientProvider';
import { cn } from '@/lib/utils';

const changeFavoriteStatus = async (lessonId: number, isFavorite: boolean) => {
  const res = await fetch(`/api/lessons/${lessonId}/change-favorite-status`, {
    method: 'POST',
    body: JSON.stringify({ isFavorite }),
  });

  const json = await res.json();

  return json.data;
};

const FavoritesButton = ({
  initialIsFavorite,
  lessonId,
}: {
  lessonId: number;
  initialIsFavorite: boolean;
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const handleFavoriteStateChange = useCallback(() => {
    return changeFavoriteStatus(lessonId, !isFavorite);
  }, [isFavorite, lessonId]);

  const mutation = useMutation({
    mutationFn: handleFavoriteStateChange,
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite);
      queryClient.invalidateQueries({ queryKey: ['favoriteLessons'] });
    },
  });

  return (
    <Button
      className={cn(
        isFavorite ? 'bg-red-200' : 'hover:bg-red-100 bg-accent',
        'rounded-full text-red-500 transition-colors duration-200 shrink-0'
      )}
      onClick={() => mutation.mutate()}
      size="icon"
    >
      <Heart
        fill={isFavorite ? '#EC3538' : '#ffffff00'}
        className="transition-colors duration-200"
      />
    </Button>
  );
};

export default FavoritesButton;
