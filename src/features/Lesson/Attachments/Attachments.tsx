'use client';

import { BaseAttachment } from '@/server/db/types';
import { useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
export interface AttachmentsProps {
  attachments?: BaseAttachment[];
}

const Attachments = ({ attachments }: AttachmentsProps) => {
  const fetchAttachment = async ({
    internalName,
    name,
  }: {
    internalName: string;
    name: string;
  }) => {
    const res = await fetch(`/api/attachments/${internalName}`, {
      method: 'GET',
    });
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const mutation = useMutation({
    mutationFn: ({
      internalName,
      name,
    }: {
      internalName: string;
      name: string;
    }) => fetchAttachment({ internalName, name }),
  });

  if (!attachments) {
    return;
  }

  return (
    <div className="space-x-2">
      {attachments.map(({ id, name, internalName }) => (
        <button
          key={id}
          onClick={() => mutation.mutate({ internalName, name })}
          className="inline-flex items-center gap-2 p-2 bg-accent underline rounded-md"
        >
          <Download className="h-4 w-4" />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
};

export default Attachments;
