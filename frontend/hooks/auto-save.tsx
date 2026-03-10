'use client';

import { saveArticle } from '@/services/articles';
import { useEffect, useRef, useState } from 'react';

type AutoSaveProps = {
  articleId?: string;
  content: any;
  onArticleIdReceived?: (articleId: string) => void;
};

export function useAutoSave({ articleId, content, onArticleIdReceived }: AutoSaveProps) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentHashRef = useRef<string>('');

  useEffect(() => {
    if (content == null) return;

    const {
      title,
      slug,
      category,
      isFeatured,
      createdAt,
      contentJson,
      contentHtml,
      featuredImage,
    } = content;

    // Check if at least one field is filled
    const hasContent =
      title?.trim() ||
      slug?.trim() ||
      category !== null ||
      contentHtml?.trim() ||
      featuredImage;

    if (!hasContent) {
      console.log('Auto-save skipped: No content to save');
      return;
    }

    const payload = {
      articleId,
      title,
      slug,
      category,
      isFeatured,
      createdAt,
      status: 'draft',
      contentJson,
      ...(contentHtml && { contentHtml }),
      ...(featuredImage && { featuredImage }),
    };

    const hash = JSON.stringify(payload);
    if (hash === lastSentHashRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        console.log('Auto-saving draft...', payload);
        const res = await saveArticle(payload);
        lastSentHashRef.current = hash;

        if (res?.article?.updatedAt) setLastSavedAt(new Date(res.article.updatedAt));

        if (res?.articleId && !articleId && onArticleIdReceived) {
          onArticleIdReceived(res.articleId);
          console.log('Received new articleId from server:', res.articleId);
        }
      } finally {
        setIsSaving(false);
      }
    }, 10000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, articleId, onArticleIdReceived]);

  return { lastSavedAt, isSaving };
}
