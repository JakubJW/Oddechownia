'use client';

import {
  DropzoneContent,
  DropzoneEmptyState,
  Dropzone,
} from '@/components/ui/shadcn-io/dropzone';
import { DropzoneProps } from '@/components/ui/shadcn-io/dropzone';
import { useState } from 'react';

type FileUploadProps = {
  onChange: (files: File[]) => void;
} & DropzoneProps;

const FileUpload = ({ onChange, accept, maxFiles }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const handleDrop = async (files: File[]) => {
    if (files.length > 0) {
      setFiles(files);
      onChange(files);
    }
  };

  return (
    <Dropzone
      className="aspect-video"
      accept={accept}
      onDrop={handleDrop}
      src={files}
      maxFiles={maxFiles}
      onError={(e) => console.log(e)}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};

export default FileUpload;
