import { Plus } from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { FaYoutube, FaImage, FaVideo } from 'react-icons/fa';
import Popup from '@/components/ui/popup';

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
    uploadVideo: () => Promise<string>;
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
    id: 'video-upload',
    label: 'Video (Upload)',
    icon: 'video-upload',
    onClick: async () => {
      const url = await opts.uploadVideo();
      editor.commands.setVideo({ src: url });
    },
  },
  {
    id: 'video',
    label: 'Video (YouTube)',
    icon: 'youtube',
    onClick: async () => {
      const url = await opts.askYoutubeUrl();
      if (!url) return;
      editor.commands.setYoutubeVideo({ src: url });
    },
  },
];

const BlockMenu = ({ editor }: { editor: any }) => {
  const [open, setOpen] = useState(false);
  const [youtubePopup, setYoutubePopup] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeError, setYoutubeError] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const youtubeResolveRef = useRef<((url: string | null) => void) | null>(null);

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

  const handleImageUpload = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!fileInputRef.current) {
        reject(new Error('File input not available'));
        return;
      }

      // Reset the input value to allow selecting the same file again
      fileInputRef.current.value = '';

      const handleChange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        if (!file.type.startsWith('image/')) {
          reject(new Error('Please select an image file'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          resolve(url);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      };

      const handleCancel = () => {
        window.removeEventListener('focus', handleCancel);
        setTimeout(() => {
          if (fileInputRef.current && !fileInputRef.current.files?.length) {
            reject(new Error('File selection cancelled'));
          }
        }, 300);
      };

      fileInputRef.current.onchange = handleChange;
      window.addEventListener('focus', handleCancel, { once: true });
      fileInputRef.current.click();
    });
  };

  const handleVideoUpload = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!videoInputRef.current) {
        reject(new Error('Video input not available'));
        return;
      }

      // Reset the input value to allow selecting the same file again
      videoInputRef.current.value = '';

      const handleChange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        if (!file.type.startsWith('video/')) {
          reject(new Error('Please select a video file'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          resolve(url);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      };

      const handleCancel = () => {
        window.removeEventListener('focus', handleCancel);
        setTimeout(() => {
          if (videoInputRef.current && !videoInputRef.current.files?.length) {
            reject(new Error('File selection cancelled'));
          }
        }, 300);
      };

      videoInputRef.current.onchange = handleChange;
      window.addEventListener('focus', handleCancel, { once: true });
      videoInputRef.current.click();
    });
  };

  const handleYoutubeUrl = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      youtubeResolveRef.current = resolve;
      setYoutubeUrl('');
      setYoutubeError('');
      setYoutubePopup(true);
    });
  };

  const submitYoutubeUrl = () => {
    if (!youtubeUrl.trim()) {
      setYoutubeError('Please enter a YouTube URL');
      return;
    }

    // Validate YouTube URL
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(youtubeUrl)) {
      setYoutubeError('Please enter a valid YouTube URL');
      return;
    }

    if (youtubeResolveRef.current) {
      youtubeResolveRef.current(youtubeUrl);
      youtubeResolveRef.current = null;
    }
    setYoutubePopup(false);
  };

  const cancelYoutubeUrl = () => {
    if (youtubeResolveRef.current) {
      youtubeResolveRef.current(null);
      youtubeResolveRef.current = null;
    }
    setYoutubePopup(false);
  };

  const actions = useMemo(() => {
    if (!editor) return [];
    return buildBlockActions(editor, {
      uploadImage: handleImageUpload,
      uploadVideo: handleVideoUpload,
      askYoutubeUrl: handleYoutubeUrl,
    });
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="relative" ref={menuRef}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={() => {}} // Handled in handleImageUpload
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={() => {}} // Handled in handleVideoUpload
      />

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
                  setOpen(false);
                } catch (error) {
                  // Keep menu open if there's an error (e.g., user cancelled)
                  console.log('Upload cancelled or failed:', error);
                }
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
            >
              {a.icon === 'youtube' ? (
                <FaYoutube className="inline mr-2" size={18} color="red" />
              ) : a.icon === 'video-upload' ? (
                <FaVideo className="inline mr-2" size={18} color="purple" />
              ) : a.icon === 'image' ? (
                <FaImage className="inline mr-2" size={18} color="blue" />
              ) : null}
              {a.label}
            </button>
          ))}
        </div>
      )}

      <Popup open={youtubePopup} onClose={cancelYoutubeUrl}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <FaYoutube className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Embed YouTube Video</h2>
              <p className="text-sm text-gray-500">Paste the YouTube video URL below</p>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
                setYoutubeError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitYoutubeUrl();
                }
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {youtubeError && <p className="mt-2 text-sm text-red-600">{youtubeError}</p>}
            <p className="mt-2 text-xs text-gray-400">
              Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={cancelYoutubeUrl}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitYoutubeUrl}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2"
            >
              <FaYoutube size={18} />
              Embed Video
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default BlockMenu;
