'use client';
import { use, useState } from 'react';
import { StatsCard } from '../../../../components/admin/states-card';
import { StatusBadge } from '../../../../components/admin/status-badge';
import { SlidersHorizontal } from 'lucide-react';

type ArticleStatus = 'active' | 'inactive';
interface Article {
  id: number;
  title: string;
  slug: string;
  author: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
  isActive: boolean;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'The Shifting Balance of Power',
    slug: 'the-shifting-balance-of-power',
    category: 'Analysis',
    author: 'John Doe',
    isFeatured: true,
    createdAt: new Date('2024-06-01'),
    isActive: true,
  },
  {
    id: 2,
    title: 'Climate Change: A Global Challenge',
    slug: 'climate-change-a-global-challenge',
    category: 'Environment',
    author: 'Jane Smith',
    isFeatured: false,
    createdAt: new Date('2024-06-02'),
    isActive: false,
  },
  {
    id: 3,
    title: 'The Future of Artificial Intelligence',
    slug: 'the-future-of-artificial-intelligence',
    category: 'Technology',
    author: 'Mike Johnson',
    isFeatured: true,
    createdAt: new Date('2024-06-03'),
    isActive: true,
  },
];

export default function ArticlesPage() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const total = articles.length;
  const active = articles.filter((a) => a.isActive).length;
  const inactive = total - active;

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard title="TOTAL ARTICLES" value={total} color="bg-[#E63946]" />
        <StatsCard title="ACTIVE ARTICLES" value={active} color="bg-[#457B9D]" />
        <StatsCard title="INACTIVE ARTICLES" value={inactive} color="bg-[#1D3557]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md">
        <div className="overflow-x-auto">
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
              {articles.map((article) => (
                <tr key={article.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-blue-600">{article.id}</td>
                  <td className="px-6 py-4 font-semibold">{article.title}</td>
                  <td className="px-6 py-4">{article.slug}</td>
                  <td className="px-6 py-4">{article.author}</td>
                  <td className="px-6 py-4">{article.category}</td>
                  <td className="px-6 py-4">{article.isFeatured ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={article.isActive ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">{article.createdAt.toDateString()}</td>
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
                      <div className="absolute right-0 z-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-fade-in">
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            /* TODO: handle view */ setOpenMenuId(null);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            /* TODO: handle preview */ setOpenMenuId(null);
                          }}
                        >
                          Preview
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            /* TODO: handle change status */ setOpenMenuId(null);
                          }}
                        >
                          Change Status
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
