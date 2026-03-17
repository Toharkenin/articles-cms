'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ArticleCard from '../../components/layout/article-card';
import Hero from '../../components/layout/hero';
import NewsletterSignup from '../../components/site/newsletter-signup';
import { fetchArticles } from '@/services/articles';

// Helper function to calculate read time from HTML content
function calculateReadTime(htmlContent: string): string {
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min`;
}

// Helper function to extract excerpt from HTML
function extractExcerpt(htmlContent: string, maxLength: number = 150): string {
  const text = htmlContent.replace(/<[^>]*>/g, '');
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export default function HomePage() {
  const [featuredArticle, setFeaturedArticle] = useState<any>(null);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [firstCategory, setFirstCategory] = useState<string>('');
  const [secondCategory, setSecondCategory] = useState<string>('');
  const [firstCategoryArticles, setFirstCategoryArticles] = useState<any[]>([]);
  const [secondCategoryArticles, setSecondCategoryArticles] = useState<any[]>([]);
  const [articlesByCategory, setArticlesByCategory] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetchArticles();
        console.log('Fetched articles:', response);
        const allArticles = response.articles.data || [];

        // Filter for published articles only
        const publishedArticles = allArticles.filter(
          (article: any) => article.status === 'published'
        );

        // Sort by date (newest first)
        publishedArticles.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Get featured article (main article first, then featured, then latest)
        const featured =
          publishedArticles.find((article: any) => article.mainArticle) ||
          publishedArticles.find((article: any) => article.isFeatured) ||
          publishedArticles[0];
        setFeaturedArticle(featured);

        // Get latest 3 articles (excluding featured)
        const latest = publishedArticles
          .filter((article: any) => article.id !== featured?.id)
          .slice(0, 3);
        setLatestArticles(latest);

        // Group articles by category
        const grouped: Record<string, any[]> = {};
        publishedArticles.forEach((article: any) => {
          const categoryName = article.category?.name;
          if (categoryName) {
            if (!grouped[categoryName]) {
              grouped[categoryName] = [];
            }
            grouped[categoryName].push(article);
          }
        });
        setArticlesByCategory(grouped);

        // Get first two categories with articles
        const categoryKeys = Object.keys(grouped);
        const first = categoryKeys[0];
        const second = categoryKeys[1];

        setFirstCategory(first || '');
        setSecondCategory(second || '');
        setFirstCategoryArticles(first ? grouped[first].slice(0, 2) : []);
        setSecondCategoryArticles(second ? grouped[second].slice(0, 2) : []);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="bg-white">
      {isLoading ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">Loading articles...</p>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && (
            <section className="py-12 border-b border-gray-200">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="site-heading text-3xl">Featured Analysis</h2>
                </div>
                <ArticleCard
                  slug={featuredArticle.slug}
                  title={featuredArticle.title}
                  category={featuredArticle.category?.name || 'Uncategorized'}
                  image={featuredArticle.featuredImage || '/hero.jpg'}
                  author={featuredArticle.author?.name || 'Anonymous'}
                  excerpt={extractExcerpt(featuredArticle.contentHtml || '')}
                  publishedAt={new Date(featuredArticle.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  readTime={calculateReadTime(featuredArticle.contentHtml || '')}
                  variant="featured"
                />
              </div>
            </section>
          )}

          {/* Latest Articles */}
          {latestArticles.length > 0 && (
            <section className="py-12 border-b border-gray-200">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="site-heading text-3xl">Latest Articles</h2>
                  <Link
                    href="/articles"
                    className="text-theme-blue hover:text-theme-dark font-medium transition"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {latestArticles.map((article: any) => (
                    <ArticleCard
                      key={article.id}
                      slug={article.slug}
                      title={article.title}
                      category={article.category?.name || 'Uncategorized'}
                      image={article.featuredImage || '/hero.jpg'}
                      author={article.author?.name || 'Anonymous'}
                      excerpt={extractExcerpt(article.contentHtml || '')}
                      publishedAt={new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      readTime={calculateReadTime(article.contentHtml || '')}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* First Category Section */}
          {firstCategory && firstCategoryArticles.length > 0 && (
            <section className="py-12 bg-gray-50 border-b border-gray-200">
              <div className="w-[90%] mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="site-heading text-3xl">{firstCategory}</h2>
                  <Link
                    href={`/categories/${articlesByCategory[firstCategory][0]?.category?.slug || firstCategory.toLowerCase()}`}
                    className="text-theme-blue hover:text-theme-dark font-medium transition"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {firstCategoryArticles.map((article: any) => (
                    <ArticleCard
                      key={article.id}
                      slug={article.slug}
                      title={article.title}
                      category={article.category?.name || 'Uncategorized'}
                      image={article.featuredImage || '/hero.jpg'}
                      author={article.author?.name || 'Anonymous'}
                      excerpt={extractExcerpt(article.contentHtml || '')}
                      publishedAt={new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      readTime={calculateReadTime(article.contentHtml || '')}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Second Category Section */}
          {secondCategory && secondCategoryArticles.length > 0 && (
            <section className="py-12 border-b border-gray-200">
              <div className="w-[90%] mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="site-heading text-3xl">{secondCategory}</h2>
                  <Link
                    href={`/categories/${articlesByCategory[secondCategory][0]?.category?.slug || secondCategory.toLowerCase()}`}
                    className="text-theme-blue hover:text-theme-dark font-medium transition"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {secondCategoryArticles.map((article: any) => (
                    <ArticleCard
                      key={article.id}
                      slug={article.slug}
                      title={article.title}
                      category={article.category?.name || 'Uncategorized'}
                      image={article.featuredImage || '/hero.jpg'}
                      author={article.author?.name || 'Anonymous'}
                      excerpt={extractExcerpt(article.contentHtml || '')}
                      publishedAt={new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      readTime={calculateReadTime(article.contentHtml || '')}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
}
