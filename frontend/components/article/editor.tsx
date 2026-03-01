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
import { ReactNodeViewRenderer } from '@tiptap/react';
import ResizableImageComponent from './resizble-image';
import ResizableVideoComponent from './resizable-video';

type Props = {
  onChange?: (json: any, html: string) => void;
};

export default function ArticleEditor({ onChange }: Props) {
  const CustomImage = Image.extend({
    draggable: true,
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: null,
        },
        height: {
          default: null,
        },
        offsetX: {
          default: 0,
        },
      };
    },
    addNodeView() {
      return ReactNodeViewRenderer(ResizableImageComponent);
    },
  });

  const Video = Node.create({
    name: 'video',
    group: 'block',
    atom: true,
    draggable: true,
    inline: false,
    addAttributes() {
      return {
        src: { default: null },
        controls: { default: true },
        width: { default: null },
        height: { default: null },
        offsetX: { default: 0 },
      };
    },
    parseHTML() {
      return [
        {
          tag: 'video[src]',
          getAttrs: (dom) => {
            const element = dom as HTMLVideoElement;
            return {
              src: element.getAttribute('src'),
              width: element.getAttribute('width'),
              height: element.getAttribute('height'),
              offsetX: element.getAttribute('data-offset-x')
                ? parseInt(element.getAttribute('data-offset-x')!)
                : 0,
            };
          },
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        'video',
        {
          src: HTMLAttributes.src,
          controls: HTMLAttributes.controls,
          width: HTMLAttributes.width,
          height: HTMLAttributes.height,
          'data-offset-x': HTMLAttributes.offsetX || 0,
          style:
            HTMLAttributes.width && HTMLAttributes.height
              ? `width: ${HTMLAttributes.width}px; height: ${HTMLAttributes.height}px;`
              : undefined,
        },
      ];
    },
    addNodeView() {
      return ReactNodeViewRenderer(ResizableVideoComponent);
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
          const { $from } = editor.state.selection;

          if ($from.parent.type.name !== 'heading') {
            return false;
          }

          const level = $from.parent.attrs.level;

          return editor.chain().focus().splitBlock().setNode('heading', { level }).run();
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
      CustomImage.configure({ inline: false, allowBase64: true }),
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
