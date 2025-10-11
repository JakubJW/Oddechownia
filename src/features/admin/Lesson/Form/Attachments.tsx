import { Label } from '@radix-ui/react-label';
import { Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FormAttachments = () => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState<number[]>([]);

  return (
    <div className="space-y-2">
      <Label>Załączniki</Label>
      {lesson &&
        lesson.attachments &&
        lesson.attachments
          .filter((attachment) => !attachmentsToRemove.includes(attachment.id))
          .map((attachment) => (
            <div
              key={attachment.id}
              className="flex justify-between items-center"
            >
              <Link
                className="underline"
                href={attachment.url}
                target="_blank"
              >
                {attachment.name}
              </Link>
              <button
                className="p-1 rounded-md bg-destructive text-destructive-foreground"
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
      {attachments.map((file) => (
        <div
          key={file.name}
          className="flex justify-between items-center"
        >
          <Link
            className="underline"
            href={URL.createObjectURL(file)}
            target="_blank"
          >
            {file.name}
          </Link>
          <button
            className="p-1 rounded-md bg-destructive text-destructive-foreground"
            onClick={() => handleRemoveFile(file.name)}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Dropzone
        maxFiles={3}
        onDrop={handleDrop}
        onError={console.error}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

export default FormAttachments;
