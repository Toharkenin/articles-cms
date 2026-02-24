import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import BlockMenu from './block-menu';
import {
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaListUl,
  FaParagraph,
  FaQuoteLeft,
} from 'react-icons/fa';
import { useEditorState } from '@tiptap/react';

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),

  Image.configure({ inline: false, allowBase64: false }),
  Youtube.configure({ inline: false, width: 640, height: 360 }),
  Link.configure({ openOnClick: false }),
  Placeholder.configure({
    placeholder: 'Start writing your article here...',
  }),
];

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      h1: editor.isActive('heading', { level: 1 }),
      h2: editor.isActive('heading', { level: 2 }),
      h3: editor.isActive('heading', { level: 3 }),
      paragraph: editor.isActive('paragraph'),
      quote: editor.isActive('blockquote'),
      ul: editor.isActive('bulletList'),
      ol: editor.isActive('orderedList'),
      left:
        editor.isActive('paragraph', { textAlign: 'left' }) ||
        editor.isActive('heading', { textAlign: 'left' }),
      center:
        editor.isActive('paragraph', { textAlign: 'center' }) ||
        editor.isActive('heading', { textAlign: 'center' }),
      right:
        editor.isActive('paragraph', { textAlign: 'right' }) ||
        editor.isActive('heading', { textAlign: 'right' }),
      justify:
        editor.isActive('paragraph', { textAlign: 'justify' }) ||
        editor.isActive('heading', { textAlign: 'justify' }),
    }),
  });

  const btn = (active: boolean) =>
    `px-3 py-1 text-sm border rounded ${
      active ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'
    }`;

  const mkBtnProps = () => ({
    type: 'button' as React.ButtonHTMLAttributes<any>['type'],
    onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
  });

  const isAligned = (align: 'left' | 'center' | 'right' | 'justify') =>
    editor.isActive('paragraph', { textAlign: align }) ||
    editor.isActive('heading', { textAlign: align });

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-2 bg-white sticky top-0 z-10">
      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btn(editorState.h1)}
      >
        <span className="font-bold">H1</span>
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editorState.h2)}
      >
        <span className="font-bold">H2</span>
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btn(editorState.h3)}
      >
        <span className="font-bold">H3</span>
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={btn(editorState.paragraph)}
      >
        <span className="font-bold">P</span>
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={btn(editorState.left)}
        title="Align Left"
      >
        <FaAlignLeft size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={btn(editorState.center)}
        title="Align Center"
      >
        <FaAlignJustify size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={btn(editorState.right)}
        title="Align Right"
      >
        <FaAlignRight size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editorState.bold)}
      >
        <FaBold size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editorState.italic)}
      >
        <FaItalic size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editorState.underline)}
      >
        <FaUnderline size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editorState.quote)}
      >
        <FaQuoteLeft size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editorState.ul)}
      >
        <FaListUl size={18} />
      </button>

      <button
        {...mkBtnProps()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editorState.ol)}
      >
        <FaListOl size={18} />
      </button>

      <div className="ml-auto">
        <BlockMenu editor={editor} />
      </div>
    </div>
  );
};
export default Toolbar;
