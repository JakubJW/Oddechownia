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
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { formSchema as editFormSchema } from '@/app/admin/blog/edytuj-artykul/[slug]/schema';
import { formSchema as createFormSchema } from '@/app/admin/blog/dodaj-artykul/schema';
import { z } from 'zod';

interface PostFormProps {
  form: UseFormReturn<z.infer<typeof editFormSchema | typeof createFormSchema>>;
  currentImage?: string;
}

export const PostForm = ({ form, currentImage }: PostFormProps) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    currentImage ?? form.getValues('image') ?? null
  );

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
        render={() => (
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
