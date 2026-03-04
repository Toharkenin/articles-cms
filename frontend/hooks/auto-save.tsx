'use client';

import { saveArticle } from '@/services/articles';
import { useEffect, useMemo, useRef, useState } from 'react';

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

  const key = useMemo(() => `draft-${articleId || 'new'}`, [articleId]);

  useEffect(() => {
    if (content == null) return;
    localStorage.setItem(key, JSON.stringify(content));
  }, [content, key]);

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

        // Handle response structure: { success, message, article, articleId }
        if (res?.article?.updatedAt) setLastSavedAt(new Date(res.article.updatedAt));

        if (res?.articleId && !articleId && onArticleIdReceived) {
          // Remove the old 'draft-new' entry
          const oldKey = 'draft-new';
          localStorage.removeItem(oldKey);

          // Update the content with the new articleId and save to new key
          const newKey = `draft-${res.articleId}`;
          const updatedContent = { ...content, articleId: res.articleId };
          localStorage.setItem(newKey, JSON.stringify(updatedContent));

          // Notify the parent component about the new articleId
          onArticleIdReceived(res.articleId);
          console.log('Received new articleId from server:', res.articleId);
        }
      } finally {
        setIsSaving(false);
      }
    }, 20000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, articleId, onArticleIdReceived]);

  return { lastSavedAt, isSaving, storageKey: key };
}
