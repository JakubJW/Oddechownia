import { createClient } from '@/supabase/server';
import {
  UserAttributes,
  createClient as createAdminClient,
} from '@supabase/supabase-js';
import { getRequiredUser } from '@/lib/data';
import { env } from '@/env';

export enum BUCKETS {
  ATTACHMENTS = 'attachments',
  THUMBNAILS = 'thumbnails',
  WEBSITE_ASSETS = 'website_assets',
  PUBLIC_ASSETS = 'public-assets',
}

const updateUserInAuthSchema = async (params: UserAttributes) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    ...params,
  });

  return { data, error };
};

const changePasswordAuthenticated = async (password: string) => {
  const supabase = await createClient();
  const { email } = await getRequiredUser();

  if (!email) {
    return {
      data: null,
      error: 'Podczas zmiany hasła wystąpił błąd. Spróbuj ponownie później.',
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { data: null, error: 'Podane stare hasło jest nieprawidłowe.' };
  }

  const { error: updateError } = await updateUserInAuthSchema({ password });

  if (updateError) {
    return {
      data: null,
      error: 'Podczas zmiany hasła wystąpił błąd. Spróbuj ponownie później.',
    };
  }

  return { data: null, error: null };
};

const getFileUrl = (name: string, bucket: string, folder: string) => {
  const supabase = createAdminClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  let fullPath = folder;

  if (!folder.endsWith(name)) {
    const separator = folder.endsWith('/') ? '' : '/';
    fullPath = `${folder}${separator}${name}`;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fullPath);

  return { data: publicUrl, success: true, error: null };
};

const getThumbnailUrl = (bucket: string, path: string) => {
  const supabase = createAdminClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { data: publicUrl, success: true, error: null };
};

const downloadFile = async (
  fileName: string,
  bucket: string,
  folder: string
) => {
  const supabase = createAdminClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  const filePath = `${folder}/${fileName}`;

  const { data: fileData, error: downloadError } = await supabase.storage
    .from(bucket)
    .download(filePath);

  if (downloadError) {
  }
  if (!fileData) {
  }

  return fileData;
};

const uploadFile = async (file: File, bucket: string, folder: string) => {
  const supabase = createAdminClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}.${fileExtension}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Supabase Storage Upload Error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    data: { url: publicUrl, name: fileName },
    success: true,
    error: null,
  };
};

const deleteFile = async (bucket: string, paths: string[]) => {
  const supabase = createAdminClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    console.error('Supabase Storage Delete Error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

export const supabaseService = {
  downloadFile,
  getFileUrl,
  getThumbnailUrl,
  deleteFile,
  uploadFile,
  updateUserInAuthSchema,
  changePasswordAuthenticated,
};
