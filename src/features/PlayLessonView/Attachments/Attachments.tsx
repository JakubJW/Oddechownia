'use client';

import { useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { AttachmentDTO } from '@/server/models/attachment.models';
import { cn } from '@/lib/utils';

export interface AttachmentsProps {
  attachments: AttachmentDTO[];
  className?: string;
}

const downloadAttachment = async ({
  name,
  originalName,
}: {
  name: string;
  originalName: string;
}) => {
  const res = await fetch(`/api/attachments/${name}`, {
    method: 'GET',
  });
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = originalName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

const Attachments = ({ attachments, className }: AttachmentsProps) => {
  const mutation = useMutation({
    mutationFn: ({
      name,
      originalName,
    }: {
      name: string;
      originalName: string;
    }) => downloadAttachment({ name, originalName }),
  });

  if (!attachments) {
    return;
  }

  return (
    <div className={cn('space-x-2', className)}>
      {attachments.map(({ id, name, originalName }) => (
        <button
          key={id}
          onClick={() => mutation.mutate({ name, originalName })}
          className="inline-flex items-center gap-2 p-2 bg-accent underline rounded-md"
        >
          <Download className="h-4 w-4" />
          <span>{originalName}</span>
        </button>
      ))}
    </div>
  );
};

export default Attachments;
