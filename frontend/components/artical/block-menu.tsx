import { Plus } from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { FaYoutube, FaImage } from 'react-icons/fa';

type BlockAction = {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void | Promise<void>;
};

const buildBlockActions = (
  editor: any,
  opts: {
    uploadImage: () => Promise<string>;
    askYoutubeUrl: () => Promise<string | null>;
  }
): BlockAction[] => [
  {
    id: 'image',
    label: 'Image',
    icon: 'image',
    onClick: async () => {
      const url = await opts.uploadImage();
      editor.chain().focus().setImage({ src: url }).run();
    },
  },
  {
    id: 'video',
    label: 'Video (YouTube)',
    icon: 'video',
    onClick: async () => {
      const url = await opts.askYoutubeUrl();
      if (!url) return;
      editor.commands.setYoutubeVideo({ src: url });
    },
  },
];

const BlockMenu = ({ editor }: { editor: any }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const actions = useMemo(() => {
    if (!editor) return [];
    return buildBlockActions(editor, {
      uploadImage: async () => {
        const url = window.prompt('Paste image URL');
        if (!url) throw new Error('No URL');
        return url;
      },
      askYoutubeUrl: async () => {
        return window.prompt('Paste YouTube URL');
      },
    });
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 flex items-center justify-center rounded-full border-0 shadow-md bg-gradient-to-br from-[#2B4A75] to-[#3A5C88] text-white hover:brightness-110 transition"
        style={{ minWidth: 40, minHeight: 40 }}
      >
        <Plus className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute mt-2 w-56 right-0 rounded-lg border bg-white shadow-lg z-50">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={async () => {
                try {
                  await a.onClick();
                } finally {
                  setOpen(false);
                }
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
            >
              {a.icon === 'video' ? (
                <FaYoutube className="inline mr-2" size={18} color="red" />
              ) : a.icon === 'image' ? (
                <FaImage className="inline mr-2" size={18} color="blue" />
              ) : null}
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default BlockMenu;
