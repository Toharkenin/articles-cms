'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import InputEditable from '@/components/ui/input-editable';
import ArticleEditor from '@/components/article/editor';
import { saveArticle, getCategories } from '@/services/articles';
import { uploadImage } from '@/services/media';
import { useAutoSave } from '@/hooks/auto-save';
import SaveStatus from '@/components/article/auto-save-status';

type ArticleStatus = 'draft' | 'published';
type Mode = 'create' | 'edit';

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

type InitialArticle = Partial<{
  articleId: string;
  title: string;
  slug: string;
  category: Category | null;
  isFeatured: boolean;
  mainArticle: boolean;
  createdAt: Date;
  contentJson: any;
  contentHtml: string;
  featuredImage: string; // url
}>;

type ArticleFormProps = {
  mode: Mode;
  initial?: InitialArticle;
  articleIdFromRoute?: string;
  redirectAfterPublish?: (articleId: string) => string;
  cancelHref?: string;
};

export default function ArticleForm({
  mode,
  initial,
  articleIdFromRoute,
  redirectAfterPublish,
  cancelHref,
}: ArticleFormProps) {
  const router = useRouter();
  const isSubmittingRef = useRef(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [articleId, setArticleId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isMainArticle, setIsMainArticle] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<ArticleStatus | null>(null);

  const [contentJson, setContentJson] = useState<any>(null);
  const [contentHtml, setContentHtml] = useState<string>('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  const autoSlug = useMemo(() => slugify(title), [title]);

  const isFormValid = useMemo(() => {
    const finalSlug = (slug || autoSlug).trim();
    return title.trim() !== '' && finalSlug !== '' && contentHtml?.trim() !== '';
  }, [title, slug, autoSlug, contentHtml]);

  const hasAnyFieldFilled = useMemo(() => {
    return (
      title.trim() !== '' ||
      slug.trim() !== '' ||
      category !== null ||
      contentHtml?.trim() !== '' ||
      featuredImageUrl !== ''
    );
  }, [title, slug, category, contentHtml, featuredImageUrl]);

  const draftData = useMemo(
    () => ({
      articleId,
      title,
      slug,
      category,
      isFeatured,
      mainArticle: isMainArticle,
      createdAt,
      contentJson,
      contentHtml,
      featuredImage: featuredImageUrl,
    }),
    [
      articleId,
      title,
      slug,
      category,
      isFeatured,
      isMainArticle,
      createdAt,
      contentJson,
      contentHtml,
      featuredImageUrl,
    ]
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
    console.log('Form useEffect triggered. Mode:', mode, 'Initial exists:', !!initial);

    if (initial && mode === 'edit') {
      console.log('Populating form with initial data:', initial);

      const newArticleId = initial.articleId || articleIdFromRoute;
      const newTitle = initial.title || '';
      const newSlug = initial.slug || '';
      const newCategory = initial.category || null;
      const newIsFeatured = initial.isFeatured || false;
      const newIsMainArticle = initial.mainArticle || false;
      const newContentJson = initial.contentJson || null;
      const newContentHtml = initial.contentHtml || '';
      const newFeaturedImage = initial.featuredImage || '';

      console.log('Setting values:', {
        articleId: newArticleId,
        title: newTitle,
        slug: newSlug,
        category: newCategory,
        isFeatured: newIsFeatured,
        contentHtml: newContentHtml ? 'has content' : 'empty',
        featuredImage: newFeaturedImage,
      });

      setArticleId(newArticleId);
      setTitle(newTitle);
      setSlug(newSlug);
      setCategory(newCategory);
      setIsFeatured(newIsFeatured);
      setIsMainArticle(newIsMainArticle);
      setContentJson(newContentJson);
      setContentHtml(newContentHtml);
      setFeaturedImageUrl(newFeaturedImage);

      if (initial.createdAt) {
        setCreatedAt(new Date(initial.createdAt));
      }

      console.log('Form populated successfully');
    }
  }, [initial, mode, articleIdFromRoute]);

  const { lastSavedAt, isSaving: isSavingDraft } = useAutoSave({
    articleId,
    content: draftData,
    onArticleIdReceived: (id) => setArticleId(id),
  });

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitStatus === 'published') {
      setError(null);
      const finalSlug = (slug || autoSlug).trim();
      if (!title.trim()) return setError('Title is required.');
      if (!finalSlug) return setError('Slug is required.');
      if (!contentHtml?.trim()) return setError('Content is required.');
    }

    try {
      setIsSaving(true);
      setError(null);

      const payload = {
        articleId,
        title: title.trim(),
        slug: (slug || autoSlug).trim(),
        category,
        isFeatured,
        mainArticle: isMainArticle,
        createdAt,
        status: submitStatus || 'draft',
        contentJson,
        ...(contentHtml && { contentHtml }),
        ...(featuredImageUrl && { featuredImage: featuredImageUrl }),
      };

      const res = await saveArticle(payload);

      if (res?.articleId && !articleId) {
        setArticleId(res.articleId);
      }

      if (submitStatus === 'published') {
        setToastMessage('Article published successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        isSubmittingRef.current = true;
        router.push('/admin/articles');
      } else {
        setToastMessage('Draft saved successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setSubmitStatus(null);
        setError(null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {showToast && (
        <div className="fixed top-6 right-6 bg-[#00a353] text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300">
          {toastMessage}
        </div>
      )}

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
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Featured article
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-red-600 cursor-pointer"
                  checked={isMainArticle}
                  onChange={(e) => setIsMainArticle(e.target.checked)}
                />
                <span className="flex items-center gap-1.5">
                  Main article
                  <span className="text-xs text-slate-500 italic">(only one)</span>
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              {!featuredImageUrl ? (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:border-slate-400">
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsUploading(true);
                          setError(null);
                          console.log('Uploading file:', file.name);
                          const uploadResult = await uploadImage(file);
                          console.log('Full upload result:', uploadResult);

                          if (uploadResult.success && uploadResult.imageUrl) {
                            console.log('Setting image URL to:', uploadResult.imageUrl);
                            setFeaturedImageUrl(uploadResult.imageUrl);
                          } else {
                            console.error('Upload failed:', uploadResult);
                            setError(uploadResult.message || 'Failed to upload image');
                          }
                        } catch (err: any) {
                          console.error('Upload error:', err);
                          setError(err.message || 'Failed to upload image');
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3">
                  {featuredImageUrl && (
                    <button
                      type="button"
                      onClick={() => setShowImageModal(true)}
                      className="relative w-20 h-20 rounded-lg border border-slate-300 overflow-hidden hover:opacity-80 transition cursor-pointer"
                      title="Click to view full size"
                    >
                      <img
                        src={featuredImageUrl}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                  <div className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5">
                    <span className="text-sm text-slate-700 max-w-[200px] truncate">
                      {featuredImageUrl?.split('/').pop() || 'featured-image'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('')}
                      className="p-1 rounded hover:bg-slate-200 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
            <ArticleEditor
              initialContent={contentJson}
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
              disabled={!hasAnyFieldFilled || isSaving}
              onClick={() => setSubmitStatus('draft')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
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

      {/* Image Preview Modal */}
      {showImageModal && featuredImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
            >
              ✕
            </button>
            <img
              src={featuredImageUrl}
              alt="Featured Image Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
