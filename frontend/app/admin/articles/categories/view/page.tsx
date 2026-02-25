'use client';

import { StatusBadge } from '@/components/admin/status-badge';
import InputEditable from '@/components/ui/input-editable';
import { getCategories, updateCategory } from '@/services/articles';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';

type Category = {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  isActive: boolean;
  header?: string;
  image?: string;
};

export default function CategoryViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('id');
  const [category, setCategory] = useState<Category | null>(null);
  const [originalCategory, setOriginalCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        const categories = await getCategories();
        const found = categories.find((c) => c.id === parseInt(categoryId));
        setCategory(found || null);
        setOriginalCategory(found || null);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const hasChanges = () => {
    if (!category || !originalCategory) return false;
    return (
      category.name !== originalCategory.name ||
      category.description !== originalCategory.description ||
      category.header !== originalCategory.header
    );
  };

  if (loading) {
    return (
      <div className="w-[90%] mx-auto py-10">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="w-[90%] mx-auto py-10">
        <div className="text-center text-red-500">Category not found</div>
        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/admin/articles/categories')}
            className="text-blue-600 hover:underline"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const saveCategoryChanges = async (name?: string, description?: string) => {
    try {
      const response = await updateCategory(category.id, name, description);
      if (response) {
        setOriginalCategory(category);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="w-[92%] max-w-6xl mx-auto py-12">
      {showToast && (
        <div className="fixed top-6 right-6 bg-success-green text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300">
          Successfully updated
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/articles/categories')}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-[#EAF3FF] hover:text-[#2B60EA]"
            title="Back to categories"
          >
            <MdArrowBack className="w-6 h-6" />
          </button>

          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Category Details</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100/60 shadow-sm overflow-hidden">
        {category.image && (
          <div className="w-full h-64 bg-[#F4F9FF] overflow-hidden">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div
          className={`p-10 space-y-10 border-t-6 rounded-t-xl ${category.isActive ? 'border-theme-blue' : 'border-theme-red'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                ID
              </label>
              <p className="mt-2 text-lg font-semibold text-slate-900">{category.id}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </label>
              <div className="mt-2">
                <StatusBadge status={category.isActive ? 'active' : 'inactive'} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Name
              </label>
              <div className="mt-2">
                <InputEditable
                  value={category.name || ''}
                  onChange={(value) => setCategory({ ...category, name: value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Created At
              </label>
              <p className="mt-2 text-lg text-slate-700">
                {new Date(category.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {category.header && (
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Header
                </label>
                <p className="mt-2 text-lg text-slate-800 font-medium">{category.header}</p>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Description
              </label>
            </div>

            <div className="mt-3">
              {isDescriptionEditable || category.description ? (
                <InputEditable
                  value={category.description || ''}
                  placeholder={category.description ? 'Edit description...' : 'Add description...'}
                  onChange={(value) => setCategory({ ...category, description: value })}
                />
              ) : (
                <button
                  onClick={() => setIsDescriptionEditable(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#2B4A75] to-[#3A5C88] text-white font-medium hover:brightness-110 transition-all duration-200 shadow-sm"
                >
                  Add Description
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-8 border-t border-blue-100/60">
          <button
            onClick={() => {
              saveCategoryChanges(
                category.name || category.name,
                category.description || category.description
              );
            }}
            disabled={!hasChanges()}
            className={`
              px-7 py-3
              rounded-xl
              transition-all duration-200
              font-semibold
              ${
                hasChanges()
                  ? 'bg-gradient-to-br from-[#2B4A75] to-[#3A5C88] text-white hover:brightness-110 focus:ring-2 focus:ring-[#2B4A75]/40 shadow-sm'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-60'
              }
            `}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
