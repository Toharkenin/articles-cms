import { useState } from 'react';
import Popup from '@/components/ui/popup';
import { setCategory } from '@/services/articles';

interface NewCategoryPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function NewCategoryPopup({ open, onClose, onSubmit }: NewCategoryPopupProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setImage(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    try {
      const newCategory = await setCategory(name.trim(), description.trim());
      setName('');
      setDescription('');
      // setImage(null);
      // setImagePreview(null);
      setError(null);
      onSubmit(newCategory);
      onClose();
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
    }
  };

  return (
    <Popup open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="text-xl font-light mb-2">Create New Category</h2>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />

        {/* <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded border border-slate-200"
              />
            </div>
          )}
        </div> */}

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-gradient-to-br from-[#2B4A75] to-[#3A5C88] text-white font-semibold"
          >
            Create
          </button>
        </div>
      </form>
    </Popup>
  );
}
