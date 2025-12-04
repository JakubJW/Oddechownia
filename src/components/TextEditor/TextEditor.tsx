import { MinimalTiptap } from '@/components/ui/shadcn-io/minimal-tiptap';

export default function TextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  return (
    <MinimalTiptap
      content={value}
      onChange={onChange}
      placeholder="Start typing your content here..."
    />
  );
}
