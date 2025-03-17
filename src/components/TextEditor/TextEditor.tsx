'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';

export interface TextEditorProps {
  onChange: (text: string) => void;
  value: string;
}

const TextEditor = ({ onChange, value }: TextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: value ?? '<p></p>',
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className='text-editor'>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
