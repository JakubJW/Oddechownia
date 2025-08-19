'use client';

import { Playlist } from '@/db/types';
import { useState, useEffect } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortablePlaylistElement from './SortablePlaylistElement';
import dynamic from 'next/dynamic';

function MyPlaylists({ playlists }: { playlists: Playlist[] }) {
  const [playlistsClone, setPlaylists] = useState(playlists);

  useEffect(() => {
    setPlaylists(playlists);
  }, [playlists]);

  const calculatePosition = (index: number, playlists: Playlist[]) => {
    let position;

    if (index === 0 && playlists.length > 1) {
      position = playlists[1].position / 2;
    } else if (index > 0 && index < playlists.length - 1) {
      position =
        (playlists[index - 1].position + playlists[index + 1].position) / 2;
    } else {
      console.log(index, playlists.length - 1)
      console.log('trzeci')
      position = playlists[playlists.length - 1].position * 2;
    }

    return position;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!playlistsClone) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = playlistsClone.findIndex(({ id }) => id === active.id);
    const newIndex = playlistsClone.findIndex(({ id }) => id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const movedPlaylist = { ...playlistsClone[oldIndex] };

    const updatedPlaylists = arrayMove(playlistsClone, oldIndex, newIndex);

    const position = calculatePosition(newIndex, updatedPlaylists);

    updatedPlaylists.map((playlist) =>
      playlist.id === movedPlaylist.id ? { ...playlist, position } : playlist
    );

    setPlaylists(updatedPlaylists);

    await fetch(`/api/playlists/reorder/${movedPlaylist.id}`, {
      method: 'POST',
      body: JSON.stringify({ position }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }

        return res.json();
      })
      .catch((error) => {
        console.log(error);
        setPlaylists(playlistsClone);
      });
  };

  if (!playlists.length) {
    return <p>Nie masz żadnych playlist</p>;
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={playlistsClone.map(({ id }) => id)}
      >
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left py-4"></th>
              <th className="text-left py-4">Nazwa</th>
              <th className="text-left py-4">Opis</th>
              <th className="text-left py-4">Liczba lekcji</th>
              <th className="text-left py-4">Opublikowano</th>
              <th className="text-left py-4"></th>
            </tr>
          </thead>
          <tbody>
            {playlistsClone.map(
              ({ id, name, isPublished, description, slug, lessons }) => (
                <SortablePlaylistElement
                  key={id}
                  id={id}
                  name={name}
                  href={`/admin/playlisty/${slug}`}
                  isPublished={isPublished}
                  description={description}
                  lessonCount={lessons.length}
                />
              )
            )}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}

const Playlists = dynamic(() => Promise.resolve(MyPlaylists), {
  ssr: false,
});

export default Playlists;
