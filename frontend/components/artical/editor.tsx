import { useEditor, EditorContent } from '@tiptap/react';
import Toolbar, { editorExtensions } from './toolbar';

export default function Editor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: value || '<p>Start writing...</p>',
    editorProps: {
      attributes: {
        class:
          'prosemirror-editor min-h-[520px] px-6 py-5 text-lg leading-relaxed focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-slate-200 rounded-xl">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
