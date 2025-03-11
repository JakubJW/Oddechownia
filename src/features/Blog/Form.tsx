'use client';

import TextEditor from '@/components/TextEditor/TextEditor';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useState } from 'react';

interface PostFormProps<T extends z.ZodTypeAny> {
  form: any;
}

export const PostForm = <T extends z.ZodTypeAny>({
  form,
}: PostFormProps<T>) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        form.setValue('image', file);
        setPreviewImageUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tytuł</FormLabel>
            <FormControl>
              <Input
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opis</FormLabel>
            <FormControl>
              <Input
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zdjęcie główne</FormLabel>
            <FormControl>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {previewImageUrl && (
        <img
          src={previewImageUrl}
          alt="Preview"
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      )}
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Treść</FormLabel>
            <FormControl>
              <TextEditor
                onChange={field.onChange}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
