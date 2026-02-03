'use client';

import { useMutation } from '@tanstack/react-query';
import { Download, Loader2 } from 'lucide-react';
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
    <div className={cn('space-y-4', className)}>
      <p className="font-regular text-lg">Materiały do pobrania</p>
      <div className="space-y-2">
        {attachments.map(({ id, name, originalName }) => (
          <button
            key={id}
            onClick={() => mutation.mutate({ name, originalName })}
            className="block relative hover:bg-almond bg-accent transition-colors duration-300 p-2 rounded-md overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{originalName}</span>
            </div>
            {mutation.isPending && mutation.variables.name === name && (
              <div
                className={cn(
                  'bg-almond opacity-80 absolute top-0 left-0 w-full h-full flex items-center justify-center'
                )}
              >
                <Loader2 className="animate-spin" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Attachments;
