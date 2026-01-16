'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useImageCompression } from './useImageCompression';

interface PrepareResponseItem {
  path: string;
  token: string;
  originalName: string;
}

interface UseFileUploadOptions {
  folder: string;
  bucket: string;
  onSuccess?: (ids: number[], previewUrl: string) => void;
  onError?: (error: Error) => void;
}

export function useFileUpload({
  folder,
  bucket,
  onSuccess,
  onError,
}: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const { compress } = useImageCompression();

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    try {
      if (!files.length) return;

      const compressed = await Promise.all(
        files.map(async (file) => await compress(file))
      );

      const payload = compressed.map((blob, index) => {
        const originalFile = files[index];
        const name = originalFile.name.replace(/\.[^/.]+$/, '') + '.webp';
        return {
          name,
          type: blob.type,
          bucket,
          folder,
        };
      });

      const prepareRes = await fetch('/api/files/upload/prepare', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!prepareRes.ok) throw new Error('Failed to prepare upload');
      const json = await prepareRes.json();
      const prepareData: PrepareResponseItem[] = json.data;

      const supabase = createClient();
      const uploadPromises = prepareData.map(async (item, index) => {
        const fileToUpload = compressed[index];
        return await supabase.storage
          .from(bucket)
          .uploadToSignedUrl(item.path, item.token, fileToUpload);
      });

      const uploadResults = await Promise.all(uploadPromises);

      const successfulPaths: string[] = [];
      uploadResults.forEach((result, index) => {
        if (result.data && !result.error) {
          successfulPaths.push(prepareData[index].path);
        }
      });

      if (successfulPaths.length === 0) {
        throw new Error('All uploads failed');
      }

      const previewUrl = URL.createObjectURL(compressed[0]);

      const completeRes = await fetch('/api/files/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: successfulPaths }),
      });

      if (!completeRes.ok) throw new Error('Failed to complete upload');

      const { ids } = await completeRes.json();

      if (onSuccess) {
        onSuccess(ids, previewUrl);
      }

      return ids;
    } catch (error) {
      console.error(error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFiles, isUploading };
}
