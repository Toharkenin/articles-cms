'use client';
import { useState, useEffect } from 'react';
import { StatsCard } from '../../../components/admin/states-card';
import { ArticleStatusBadge } from '../../../components/admin/article-status-badge';
import { SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GrView } from 'react-icons/gr';
import { MdDeleteOutline, MdOutlineArticle } from 'react-icons/md';
import { TbStatusChange } from 'react-icons/tb';
import { deleteDraftArticle, fetchArticles, changeArticleStatus } from '../../../services/articles';
import { SuccessPopup } from '@/components/ui/success-popup';
import { RiInboxUnarchiveLine, RiInboxArchiveLine } from 'react-icons/ri';

interface Article {
  _id?: string;
  id: number;
  articleId?: string;
  title: string;
  slug: string;
  author?: string;
  category: { name: string; id?: number } | null;
  isFeatured: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  status: 'draft' | 'published' | 'archive';
}

export default function ArticlesPage() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [showStatusChangePopup, setShowStatusChangePopup] = useState<boolean>(false);
  const [statusChangeMessage, setStatusChangeMessage] = useState<string>('');
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const response = await fetchArticles();
        console.log('Full API Response:', response);

        // Extract articles from the nested response structure
        let articlesData = [];
        if (response?.articles?.data) {
          articlesData = response.articles.data;
        } else if (response?.data) {
          articlesData = response.data;
        } else if (Array.isArray(response)) {
          articlesData = response;
        }

        console.log('Extracted articles:', articlesData);
        setArticles(articlesData);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const total = articles.length;
  const published = articles.filter((a) => a.status === 'published').length;
  const draft = articles.filter((a) => a.status === 'draft').length;
  const archived = articles.filter((a) => a.status === 'archive').length;

  if (loading) {
    return (
      <div className="px-6 py-8 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading articles...</div>
        </div>
      </div>
    );
  }

  const deleteDraft = async (id: string) => {
    try {
      await deleteDraftArticle(id);
      setShowDeletePopup(true);
      setDeleteArticleId(id);
      setArticles((prev) => prev.filter((article) => article._id !== id));
    } catch (error) {
      console.error('Failed to delete draft article:', error);
    }
  };

  const archiveArticle = async (id: string) => {
    try {
      await changeArticleStatus(id);
      setArticles((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, status: 'archive' as const } : article
        )
      );
      setStatusChangeMessage('Article archived successfully!');
      setShowStatusChangePopup(true);
      setOpenMenuId(null);
    } catch (error) {
      console.error('Failed to archive article:', error);
    }
  };

  const unarchiveArticle = async (id: string) => {
    try {
      await changeArticleStatus(id);
      setArticles((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, status: 'published' as const } : article
        )
      );
      setStatusChangeMessage('Article unarchived successfully!');
      setShowStatusChangePopup(true);
      setOpenMenuId(null);
    } catch (error) {
      console.error('Failed to unarchive article:', error);
    }
  };

  return (
    <div className="px-6 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <button
          className="
            px-4 py-2
            bg-gradient-to-br
            from-[#2B4A75]
            to-[#3A5C88]
            text-white
            rounded-lg
            transition-all duration-200
            hover:brightness-110
            focus:outline-none
            focus:ring-2
            focus:ring-[#2B4A75]/40
            cursor-pointer
          "
          onClick={() => router.push('/admin/articles/new')}
        >
          + New Article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard title="TOTAL ARTICLES" value={total} color="bg-theme-red" />
        <StatsCard title="PUBLISHED" value={published} color="bg-theme-blue" />
        <StatsCard title="DRAFT" value={draft} color="bg-gray-500" />
        <StatsCard title="ARCHIVED" value={archived} color="bg-theme-dark" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Slug</th>
              <th className="px-6 py-4 text-left">Author</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Featured</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created At</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.map((article, index) => (
              <tr
                key={article._id || article.id || index}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-blue-600">{article.id || index + 1}</td>
                <td className="px-6 py-4 font-semibold">{article.title || 'Untitled'}</td>
                <td className="px-6 py-4">{article.slug || '-'}</td>
                <td className="px-6 py-4">{article.author || 'Unknown'}</td>
                <td className="px-6 py-4">{article.category?.name || 'N/A'}</td>
                <td className="px-6 py-4">{article.isFeatured ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4">
                  <ArticleStatusBadge status={article.status} />
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {article.createdAt ? new Date(article.createdAt).toDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 relative">
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    title="More actions"
                    onClick={() => setOpenMenuId(openMenuId === article.id ? null : article.id)}
                  >
                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                  {openMenuId === article.id && (
                    <div className="menu-dropdown absolute right-0 mt-3 w-44 bg-white border border-blue-100 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          /* TODO: handle view */ setOpenMenuId(null);
                        }}
                      >
                        <GrView size={16} className="inline-block mr-2" />
                        View
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          router.push(`/admin/articles/${article._id}/edit`);
                          setOpenMenuId(null);
                        }}
                      >
                        <MdOutlineArticle size={16} className="inline-block mr-2" />
                        Edit
                      </button>
                      {article.status === 'published' ? (
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => archiveArticle(article._id!)}
                        >
                          <RiInboxArchiveLine size={16} className="inline-block mr-2" />
                          Archive
                        </button>
                      ) : article.status === 'archive' ? (
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => unarchiveArticle(article._id!)}
                        >
                          <RiInboxUnarchiveLine size={16} className="inline-block mr-2" />
                          Unarchive
                        </button>
                      ) : (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={() => deleteDraft(article._id!)}
                        >
                          <MdDeleteOutline size={16} className="inline-block mr-2" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SuccessPopup
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        title="Draft Deleted!"
        description="The draft article has been successfully deleted."
      />
      
      <SuccessPopup
        open={showStatusChangePopup}
        onClose={() => setShowStatusChangePopup(false)}
        title="Status Updated!"
        description={statusChangeMessage}
      />
    </div>
  );
}
