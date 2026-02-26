'use client';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { Node } from '@tiptap/core';
import Toolbar from '@/components/article/toolbar';

type Props = {
  onChange?: (json: any, html: string) => void;
};

export default function ArticleEditor({ onChange }: Props) {
  const Video = Node.create({
    name: 'video',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
      return {
        src: { default: null },
        controls: { default: true },
      };
    },
    parseHTML() {
      return [{ tag: 'video[src]' }];
    },
    renderHTML({ HTMLAttributes }) {
      return ['video', { ...HTMLAttributes, style: 'max-width: 100%;' }, 0];
    },
    addCommands() {
      return {
        setVideo:
          (options: { src: string }) =>
          ({ commands }: any) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
      } as any;
    },
  });

  const KeepHeadingOnEnter = Extension.create({
    name: 'keepHeadingOnEnter',
    priority: 1000,
    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          const { state } = editor;
          const { $from } = state.selection;

          if ($from.parent.type.name === 'heading') {
            editor.commands.splitBlock();
            editor.commands.setNode('heading', {
              level: $from.parent.attrs.level,
            });
            return true;
          }

          return false;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      KeepHeadingOnEnter,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Video,
      Youtube.configure({ inline: false, width: 640, height: 360 }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: 'Start writing your article here...',
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prosemirror-editor w-full max-w-full min-h-[520px] px-6 py-5 text-lg leading-relaxed focus:outline-none break-words',
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getJSON(), editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl w-full overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
