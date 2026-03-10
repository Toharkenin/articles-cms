'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleForm from '@/components/article/article-form';
import { getArticleById } from '@/services/articles';

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getArticleById(id);
        console.log('Full API Response:', response);

        const articleData = response?.article?.data || response?.data || response;
        console.log('Extracted article data:', articleData);
        console.log('Article fields:', {
          articleId: articleData?.articleId,
          title: articleData?.title,
          slug: articleData?.slug,
          category: articleData?.category,
          isFeatured: articleData?.isFeatured,
          contentJson: articleData?.contentJson,
          contentHtml: articleData?.contentHtml,
          featuredImage: articleData?.featuredImage,
          createdAt: articleData?.createdAt,
        });

        setInitial(articleData);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xl text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!initial) return null;

  return (
    <ArticleForm
      mode="edit"
      initial={initial}
      articleIdFromRoute={id}
      redirectAfterPublish={(articleId) => `/admin/articles/${articleId}`}
    />
  );
}
