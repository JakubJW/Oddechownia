'use client';

import { Editor } from '@tiptap/react';
import { Heading2, Bold, Italic, Underline } from 'lucide-react';
import { Toggle } from '../ui/toggle';

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading')}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading')}
        onPressedChange={() => editor.chain().focus().toggle().run()}
      >
        <Underline />
      </Toggle>
    </div>
  );
}
