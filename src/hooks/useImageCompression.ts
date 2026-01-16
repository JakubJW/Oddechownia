import imageCompression, { Options } from 'browser-image-compression';

const defaultOptions: Options = {
  maxSizeMB: 0.3,
  maxWidthOrHeight: 1280,
  useWebWorker: true,
  fileType: 'image/webp',
};

export const useImageCompression = () => {
  const compress = async (file: File, options?: Options) => {
    const compressed = await imageCompression(file, {
      ...defaultOptions,
      ...options,
    });

    return compressed;
  };

  return {
    compress,
  };
};
