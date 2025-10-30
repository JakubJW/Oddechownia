'use client';

import {
  DropzoneContent,
  DropzoneEmptyState,
  Dropzone,
} from '@/components/ui/shadcn-io/dropzone';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface FormThumbnailProps {
  onDrop: (files: File[]) => void;
  removeOldThumbnailHandler: (value: boolean) => void;
  thumbnail?: File[];
  currentThumbnailUrl?: string;
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-2">
      <Label>Miniaturka</Label>
      <div className="rounded-md overflow-hidden">{children}</div>
    </div>
  );
};

const FormThumbnail = ({
  onDrop,
  thumbnail,
  currentThumbnailUrl,
  removeOldThumbnailHandler,
}: FormThumbnailProps) => {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [wantsToChangeThumbnail, setWantsToChangeThumbnail] = useState(false);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      onDrop(files);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setPreview(e.target?.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRequestThumbnailChange = () => {
    setWantsToChangeThumbnail(true);
    removeOldThumbnailHandler(true);
  };

  const handleCancelThumbnailChange = () => {
    setPreview(undefined);
    onDrop([]);
    setWantsToChangeThumbnail(false);
    removeOldThumbnailHandler(false);
  };

  if (currentThumbnailUrl && !wantsToChangeThumbnail) {
    return (
      <Wrapper>
        <img
          alt="Current thumbnail preview"
          className="h-auto w-full w-full object-cover"
          src={currentThumbnailUrl}
        />
        <button
          type="button"
          onClick={handleRequestThumbnailChange}
        >
          Zmień
        </button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Dropzone
        className="aspect-video"
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        onDrop={handleDrop}
        src={thumbnail}
        maxFiles={1}
        onError={(e) => console.log(e)}
      >
        <DropzoneEmptyState />
        <DropzoneContent>
          {preview && (
            <div className="h-[102px] w-full">
              <img
                alt="Preview"
                className="absolute z-0 top-0 left-0 h-full w-full object-cover"
                src={preview}
              />
            </div>
          )}
        </DropzoneContent>
      </Dropzone>
      {wantsToChangeThumbnail && (
        <button
          type="button"
          onClick={handleCancelThumbnailChange}
        >
          Anuluj
        </button>
      )}
    </Wrapper>
  );
};

export default FormThumbnail;
