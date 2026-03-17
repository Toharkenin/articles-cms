'use client';
import { useState, useEffect, useMemo } from 'react';
import { StatsCard } from '../../../components/admin/states-card';
import { ArticleStatusBadge } from '../../../components/admin/article-status-badge';
import { useRouter } from 'next/navigation';
import { GrView } from 'react-icons/gr';
import { MdDeleteOutline, MdOutlineArticle } from 'react-icons/md';
import { deleteDraftArticle, fetchArticles, changeArticleStatus } from '../../../services/articles';
import { SuccessPopup } from '@/components/ui/success-popup';
import { RiInboxUnarchiveLine, RiInboxArchiveLine } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { Table, TableColumn, TableAction } from '@/components/admin/table';
import { TableFilter, FilterField, FilterValues } from '@/components/admin/table-filter';
import { filterData } from '@/components/admin/table-filter-utils';

interface Article {
  _id?: string;
  id: number;
  articleId?: string;
  title: string;
  slug: string;
  author?: string;
  category: { name: string; id?: number } | null;
  isFeatured: boolean;
  mainArticle?: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  status: 'draft' | 'published' | 'archive';
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [showStatusChangePopup, setShowStatusChangePopup] = useState<boolean>(false);
  const [statusChangeMessage, setStatusChangeMessage] = useState<string>('');
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({});
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

  // Get unique categories for filter options
  const uniqueCategories = useMemo(() => {
    const categories = articles
      .map((a) => a.category)
      .filter((c): c is { name: string; id?: number } => c !== null);
    const uniqueMap = new Map(categories.map((c) => [c.name, c]));
    return Array.from(uniqueMap.values()).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [articles]);

  // Define filter fields
  const filterFields: FilterField[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' },
        { value: 'archive', label: 'Archived' },
      ],
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      type: 'select',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: uniqueCategories,
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      type: 'dateRange',
    },
  ];

  // Filter articles based on current filters
  const filteredArticles = useMemo(() => {
    return filterData(articles, filters, ['title', 'slug', 'author'], {
      status: (article, filterValue) => article.status === filterValue,
      isFeatured: (article, filterValue) => String(article.isFeatured) === filterValue,
      category: (article, filterValue) => article.category?.name === filterValue,
    });
  }, [articles, filters]);

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
    } catch (error) {
      console.error('Failed to unarchive article:', error);
    }
  };

  // Define table columns
  const columns: TableColumn<Article>[] = [
    {
      key: 'mainArticle',
      label: '',
      render: (article) => (
        <div className="flex justify-center">
          {article.mainArticle && (
            <div className="w-3 h-3 bg-theme-red rounded-sm" title="Main Article" />
          )}
        </div>
      ),
    },
    {
      key: 'id',
      label: 'ID',
      render: (article, index) => (
        <span className="font-medium text-blue-600">{article.id || index + 1}</span>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (article) => (
        <button
          onClick={() => router.push(`/admin/articles/${article._id}/view`)}
          className="hover:text-blue-600 hover:underline cursor-pointer text-left font-semibold"
        >
          {article.title || 'Untitled'}
        </button>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
    },
    {
      key: 'author',
      label: 'Author',
      render: (article) => <span>{article.author || 'Unknown'}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      render: (article) => <span>{article.category?.name || 'N/A'}</span>,
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (article) => <span>{article.isFeatured ? 'Yes' : 'No'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (article) => <ArticleStatusBadge status={article.status} />,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (article) => (
        <span className="text-gray-500">
          {article.createdAt ? new Date(article.createdAt).toDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Article>[] = [
    {
      label: 'View',
      icon: <GrView size={16} />,
      onClick: (article) => {
        router.push(`/admin/articles/${article._id}/view`);
      },
    },
    {
      label: 'Edit',
      icon: <MdOutlineArticle size={16} />,
      onClick: (article) => {
        router.push(`/admin/articles/${article._id}/edit`);
      },
    },
    {
      label: 'Archive',
      icon: <RiInboxArchiveLine size={16} />,
      onClick: (article) => {
        archiveArticle(article._id!);
      },
      condition: (article) => article.status === 'published',
    },
    {
      label: 'Unarchive',
      icon: <RiInboxUnarchiveLine size={16} />,
      onClick: (article) => {
        unarchiveArticle(article._id!);
      },
      condition: (article) => article.status === 'archive',
    },
    {
      label: 'Delete',
      icon: <MdDeleteOutline size={16} />,
      onClick: (article) => {
        deleteDraft(article._id!);
      },
      className: 'text-red-600 hover:bg-red-50',
      condition: (article) => article.status === 'draft',
    },
  ];

  return (
    <div className="px-6 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button onClick={() => router.push('/admin/articles/new')}>+ New Article</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard title="TOTAL ARTICLES" value={total} color="bg-theme-red" />
        <StatsCard title="PUBLISHED" value={published} color="bg-theme-blue" />
        <StatsCard title="DRAFT" value={draft} color="bg-gray-500" />
        <StatsCard title="ARCHIVED" value={archived} color="bg-theme-dark" />
      </div>

      {/* Filter */}
      <TableFilter filters={filterFields} onFilterChange={setFilters} initialValues={filters} />

      {/* Table */}
      <Table
        columns={columns}
        data={filteredArticles}
        actions={actions}
        getRowKey={(article, index) => article._id || article.id || index}
        emptyMessage="No articles found matching your filters"
      />

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
