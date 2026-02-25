'use client';

import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, setContent } from '@tiptap/react';
import Toolbar, { editorExtensions } from '@/components/artical/toolbar';
import InputEditable from '@/components/ui/input-editable';
import { getCategories } from '@/services/articles';

type ArticleStatus = 'draft' | 'published';

type Category = {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  isActive: boolean;
  header?: string;
  image?: string;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function CreateArticleForm() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log('Fetched categories:', response);
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoSlug = useMemo(() => slugify(title), [title]);

  const editor = useEditor({
    extensions: editorExtensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prosemirror-editor min-h-[520px] px-6 py-5 text-lg leading-relaxed focus:outline-none',
      },
    },
  });

  const saveDraft = () => {};

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const finalSlug = (slug || autoSlug).trim();
    if (!title.trim()) return setError('Title is required.');
    if (!finalSlug) return setError('Slug is required.');
    if (!editor?.getHTML().trim()) return setError('Content is required.');

    try {
      setIsSaving(true);

      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: finalSlug,
          category: category?.id || null,
          status,
          isFeatured,
          content: editor?.getHTML() || '',
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || `Save failed (${res.status})`);
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-1xl bg-white py-10 px-26 shadow-sm w-full">
      <div className="grid gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <InputEditable
            value={title}
            onChange={setTitle}
            placeholder="e.g. The Shifting Balance of Power"
          />
        </div>

        {/* Slug + Category */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
            <InputEditable
              value={slug === '' ? autoSlug : slug}
              onChange={setSlug}
              placeholder={autoSlug || 'auto-generated-from-title'}
            />
            <p className="mt-1 text-xs text-slate-500">
              Tip: leave empty to auto-generate from title.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#2B4A75]/25"
              value={category?.id || ''}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value, 10);
                const selectedCategory = categories.find((cat) => cat.id === selectedId) || null;
                setCategory(selectedCategory);
              }}
            >
              {categories.length === 0 && <option value="General">General</option>}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status + Featured */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#2B4A75]/25"
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured article
          </label>
        </div>

        {/* Content */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
          <div className="border border-slate-200 rounded-xl">
            <Toolbar editor={editor} />
            <EditorContent
              editor={editor}
              className="prosemirror-editor min-h-[520px] px-6 py-5 text-lg leading-relaxed focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="
              inline-flex items-center justify-center
              rounded-xl px-4 py-2.5 text-white
              bg-gradient-to-br from-[#2B4A75] to-[#3A5C88]
              transition-all duration-200 hover:brightness-110
              focus:outline-none focus:ring-2 focus:ring-[#2B4A75]/40
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isSaving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>
    </form>
  );
}
