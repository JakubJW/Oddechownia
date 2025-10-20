import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone';
import { Label } from '@radix-ui/react-label';
import { Trash } from 'lucide-react';
import Link from 'next/link';
import { Attachment } from '@/server/db/types';
import { memo } from 'react';

interface FormAttachmentsProps {
  attachments?: Attachment[];
  newAttachments: File[];
  attachmentsToRemove: number[];
  onRemove: (id: number) => void;
  onAdd: (files: File[]) => void;
  onNewRemove: (name: string) => void;
}

const FormAttachments = ({
  attachments,
  newAttachments,
  attachmentsToRemove,
  onAdd,
  onRemove,
  onNewRemove,
}: FormAttachmentsProps) => {
  return (
    <div className="space-y-2">
      <Label>Załączniki</Label>
      {attachments &&
        attachments
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
                {attachment.file.originalName}
              </Link>
              <button
                type="button"
                className="p-1 rounded-md bg-destructive text-destructive-foreground"
                onClick={() => onRemove(attachment.id)}
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
      {newAttachments.map((file) => (
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
            type="button"
            className="p-1 rounded-md bg-destructive text-destructive-foreground"
            onClick={() => onNewRemove(file.name)}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Dropzone
        maxFiles={3}
        onDrop={onAdd}
        onError={console.error}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

export default memo(FormAttachments);
