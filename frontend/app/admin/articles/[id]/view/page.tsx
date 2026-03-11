'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getArticleById } from '@/services/articles';
import { BsFileImage } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { MdArrowBack } from 'react-icons/md';

interface Article {
  _id: string;
  articleId: string;
  title: string;
  slug: string;
  category: {
    id: number;
    name: string;
  };
  status: 'draft' | 'published' | 'archive';
  isFeatured: boolean;
  contentHtml: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCardPreviewOpen, setIsCardPreviewOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getArticleById(id);
        const articleData =
          response?.article?.data || response?.article || response?.data || response;
        setArticle(articleData);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsCardPreviewOpen(false);
      }
    };

    if (isCardPreviewOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCardPreviewOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">{error || 'Article not found'}</div>
        <button
          onClick={() => router.push('/admin/articles/list')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[90%] mx-auto px-4">
        {/* Header Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/admin/articles')}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-[#EAF3FF] hover:text-[#2B60EA]"
            title="Back to categories"
          >
            <MdArrowBack className="w-6 h-6" />
          </button>
          <Button
            onClick={() => router.push(`/admin/articles/${id}/edit`)}
            className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit
          </Button>
        </div>

        {/* Info Banner */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-2">
          <span className="text-sm text-gray-500">
            Preview Mode — This is how the article appears to users
          </span>

          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setIsCardPreviewOpen(!isCardPreviewOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              ⧉
            </button>

            {/* Card Preview Popup */}
            {isCardPreviewOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="group cursor-pointer">
                  {article.featuredImage && (
                    <div className="relative overflow-hidden">
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-wide px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase">
                        {article.category?.name || 'Uncategorized'}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif font-semibold text-lg text-gray-800 leading-snug line-clamp-3">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Article Content HTML */}
          <div
            className="prose prose-lg max-w-none p-8 article-content"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </article>
      </div>
    </div>
  );
}
