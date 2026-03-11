'use client';

import { StatusBadge } from '@/components/admin/status-badge';
import NewCategoryPopup from '@/components/article/new-category-popup';
import { Button } from '@/components/ui/button';
import { SuccessPopup } from '@/components/ui/success-popup';
import { changeCategoryStatus, getCategories } from '@/services/articles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GrView } from 'react-icons/gr';
import { MdOutlineArticle } from 'react-icons/md';
import { TbStatusChange } from 'react-icons/tb';
import { Table, TableColumn, TableAction } from '@/components/admin/table';

type Category = {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  isActive: boolean;
  header?: string;
  image?: string;
};

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log('Fetched categories:', response);
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const changeStatus = async (id: number) => {
    try {
      await changeCategoryStatus(id);
      setIsSuccessPopupOpen(true);
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? { ...category, isActive: !category.isActive } : category
        )
      );
    } catch (error) {
      console.error('Error changing category status:', error);
    }
  };

  // Define table columns
  const columns: TableColumn<Category>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (category) => <span className="font-semibold text-gray-800">{category.id}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (category) => <span className="text-gray-700 font-medium">{category.name}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (category) => <StatusBadge status={category.isActive ? 'active' : 'inactive'} />,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (category) => (
        <span className="text-gray-500 text-sm">
          {new Date(category.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Category>[] = [
    {
      label: 'View',
      icon: <GrView size={16} />,
      onClick: (category) => {
        router.push(`/admin/articles/categories/view?id=${category.id}`);
      },
    },
    {
      label: 'Articles',
      icon: <MdOutlineArticle size={16} />,
      onClick: (category) => {
        // Handle articles view
        console.log('View articles for category:', category.id);
      },
    },
    {
      label: 'Change Status',
      icon: <TbStatusChange size={16} />,
      onClick: (category) => {
        changeStatus(category.id);
      },
    },
  ];

  return (
    <div className="w-[90%] mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsNewCategoryOpen(true)}>+ New Category</Button>
      </div>

      <Table
        columns={columns}
        data={categories}
        actions={actions}
        getRowKey={(category) => category.id}
        emptyMessage="No categories available"
      />

      <NewCategoryPopup
        open={isNewCategoryOpen}
        onClose={() => setIsNewCategoryOpen(false)}
        onSubmit={async (newCat) => {
          setIsNewCategoryOpen(false);
          // Refetch categories to get the complete data
          try {
            const response = await getCategories();
            setCategories(response);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        }}
      />
      {isSuccessPopupOpen && (
        <SuccessPopup
          title="Status Changed Successfully!"
          open={isSuccessPopupOpen}
          onClose={() => setIsSuccessPopupOpen(false)}
        />
      )}
    </div>
  );
}
