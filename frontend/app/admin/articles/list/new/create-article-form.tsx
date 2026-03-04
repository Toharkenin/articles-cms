'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputEditable from '@/components/ui/input-editable';
import ArticleEditor from '@/components/article/editor';
import { saveArticle, getCategories } from '@/services/articles';
import { useAutoSave } from '@/hooks/auto-save';
import SaveStatus from '@/components/article/auto-save-status';

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
  const [articleId, setArticleId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<ArticleStatus | null>(null);

  const [contentJson, setContentJson] = useState<any>(null);
  const [contentHtml, setContentHtml] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [didRestore, setDidRestore] = useState(false);

  const autoSlug = useMemo(() => slugify(title), [title]);

  const isFormValid = useMemo(() => {
    const finalSlug = (slug || autoSlug).trim();
    return title.trim() !== '' && finalSlug !== '' && contentHtml?.trim() !== '';
  }, [title, slug, autoSlug, contentHtml]);

  const draftData = useMemo(
    () => ({
      articleId,
      title,
      slug,
      category,
      isFeatured,
      contentJson,
      contentHtml,
      featuredImageUrl,
    }),
    [articleId, title, slug, category, isFeatured, contentJson, contentHtml, featuredImageUrl]
  );

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

  useEffect(() => {
    // Look for draft in localStorage - check all draft-* keys
    let savedData = null;
    let foundKey = null;

    // First try draft-new
    const newKey = 'draft-new';
    const newDraft = localStorage.getItem(newKey);
    if (newDraft) {
      try {
        const parsed = JSON.parse(newDraft);
        savedData = parsed;
        foundKey = newKey;

        // If this draft has an articleId, check if there's a more recent version
        if (parsed.articleId) {
          const articleKey = `draft-${parsed.articleId}`;
          const articleDraft = localStorage.getItem(articleKey);
          if (articleDraft) {
            const articleParsed = JSON.parse(articleDraft);
            savedData = articleParsed;
            foundKey = articleKey;
          }
        }
      } catch (err) {
        console.error('Failed to parse draft:', err);
      }
    }

    if (savedData) {
      try {
        if (savedData.articleId) setArticleId(savedData.articleId);
        if (savedData.title) setTitle(savedData.title);
        if (savedData.slug) setSlug(savedData.slug);
        if (savedData.category) setCategory(savedData.category);
        if (savedData.isFeatured) setIsFeatured(savedData.isFeatured);
        if (savedData.contentJson) setContentJson(savedData.contentJson);
        if (savedData.contentHtml) setContentHtml(savedData.contentHtml);
        if (savedData.featuredImageUrl) setFeaturedImageUrl(savedData.featuredImageUrl);
      } catch (err) {
        console.error('Failed to restore draft:', err);
      }
    }

    setDidRestore(true);
  }, []);

  const {
    lastSavedAt,
    isSaving: isSavingDraft,
    storageKey,
  } = useAutoSave({
    articleId,
    content: draftData,
    onArticleIdReceived: (id) => setArticleId(id),
  });

  // Clean up local storage when leaving the page
  useEffect(() => {
    return () => {
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
    };
  }, [storageKey]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (featuredImageUrl && featuredImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(featuredImageUrl);
      }
    };
  }, [featuredImageUrl]);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const finalSlug = (slug || autoSlug).trim();

    if (!title.trim()) return setError('Title is required.');
    if (!finalSlug) return setError('Slug is required.');
    if (!contentHtml?.trim()) return setError('Content is required.');

    try {
      setIsSaving(true);

      await saveArticle({
        articleId,
        title: title.trim(),
        slug: finalSlug,
        author: 'admin',
        category: category?.id || 0,
        isFeatured,
        createdAt: new Date(),
        status: submitStatus || 'draft',
        contentJson,
        contentHtml,
        featuredImage: featuredImageUrl || '',
      });

      // Clear local storage after successful submission
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }

      router.push('/admin/articles');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
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
                <option value="">Choose category</option>
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

            <div className="flex items-center gap-2">
              {!featuredImage && !featuredImageUrl ? (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:border-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFeaturedImage(file);
                        setFeaturedImageUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-slate-700 max-w-[200px] truncate">
                    {featuredImage?.name || 'featured-image.jpg'}
                  </span>
                  <div className="flex items-center gap-1 ml-1 border-l border-slate-300 pl-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (featuredImageUrl) {
                          window.open(featuredImageUrl, '_blank');
                        }
                      }}
                      className="p-1 rounded hover:bg-slate-200 transition"
                      title="View image"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <label
                      className="p-1 rounded hover:bg-slate-200 transition cursor-pointer"
                      title="Replace image"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (featuredImageUrl) {
                              URL.revokeObjectURL(featuredImageUrl);
                            }
                            setFeaturedImage(file);
                            setFeaturedImageUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (featuredImageUrl) {
                          URL.revokeObjectURL(featuredImageUrl);
                        }
                        setFeaturedImage(null);
                        setFeaturedImageUrl('');
                      }}
                      className="p-1 rounded hover:bg-slate-200 transition"
                      title="Remove image"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
            {didRestore && (
              <ArticleEditor
                initialContent={contentJson}
                onChange={(json, html) => {
                  setContentJson(json);
                  setContentHtml(html);
                }}
              />
            )}
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
              disabled={isSaving}
              onClick={() => setSubmitStatus('draft')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>

            <button
              type="submit"
              disabled={!isFormValid || isSaving}
              onClick={() => setSubmitStatus('published')}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-white bg-gradient-to-br from-[#2B4A75] to-[#3A5C88] transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#2B4A75]/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </div>
      </form>
      <SaveStatus lastSavedAt={lastSavedAt} isSaving={isSavingDraft} />
    </div>
  );
}
