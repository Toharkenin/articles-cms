'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputEditable from '@/components/ui/input-editable';
import ArticleEditor from '@/components/article/editor';
import { createArticle, getCategories } from '@/services/articles';

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
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<ArticleStatus | null>(null);

  const [contentJson, setContentJson] = useState<any>(null);
  const [contentHtml, setContentHtml] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const finalSlug = (slug || autoSlug).trim();

    if (!title.trim()) return setError('Title is required.');
    if (!finalSlug) return setError('Slug is required.');
    if (!contentHtml?.trim()) return setError('Content is required.');

    try {
      setIsSaving(true);

      await createArticle({
        title: title.trim(),
        slug: finalSlug,
        author: 'admin',
        category: category?.id || 0,
        isFeatured,
        createdAt: new Date(),
        status: submitStatus || 'draft',
        contentJson,
        contentHtml,
        featuredImage: '',
      });

      router.push('/admin/articles');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong.');
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
            <InputEditable
              value={slug === '' ? autoSlug : slug}
              onChange={setSlug}
              placeholder={autoSlug || 'auto-generated-from-title'}
            />
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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
          <ArticleEditor
            onChange={(json, html) => {
              setContentJson(json);
              setContentHtml(html);
            }}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={() => setSubmitStatus('draft')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isSaving}
            onClick={() => setSubmitStatus('published')}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-white bg-gradient-to-br from-[#2B4A75] to-[#3A5C88] transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#2B4A75]/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>
    </form>
  );
}
