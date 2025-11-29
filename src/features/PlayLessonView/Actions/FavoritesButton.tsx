'use client';

import { useMutation } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';
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
        'bg-muted text-red-500 hover:bg-red-100 transition-colors duration-200 shrink-0 flex-1 md:flex-none'
      )}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <Loader2 className="animate-spin shrink-0 transition-colors" />
      ) : (
        <Heart
          fill={isFavorite ? '#EC3538' : '#ffffff00'}
          className="shrink-0 transition-colors duration-200"
        />
      )}{' '}
      {isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
    </Button>
  );
};

export default FavoritesButton;
