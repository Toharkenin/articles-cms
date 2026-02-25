'use client';

import { StatusBadge } from '@/components/admin/status-badge';
import NewCategoryPopup from '@/components/artical/new-category-popup';
import Popup from '@/components/ui/popup';
import { SuccessPopup } from '@/components/ui/success-popup';
import { changeCategoryStatus, getCategories } from '@/services/articles';
import { SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGripLines } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { MdOutlineArticle, MdDeleteOutline } from 'react-icons/md';
import { TbStatusChange } from 'react-icons/tb';

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
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuButton = target.closest('.menu-button');
      const isMenuDropdown = target.closest('.menu-dropdown');

      if (!isMenuButton && !isMenuDropdown) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      // Use setTimeout to avoid closing immediately after opening
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const onDragStart = (id: number) => setDraggedId(id);
  const onDragOver = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;
    const draggedIdx = categories.findIndex((c) => c.id === draggedId);
    const overIdx = categories.findIndex((c) => c.id === id);
    if (draggedIdx === -1 || overIdx === -1) return;
    const updated = [...categories];
    const [removed] = updated.splice(draggedIdx, 1);
    updated.splice(overIdx, 0, removed);
    setCategories(updated);
    setDraggedId(id);
  };
  const onDragEnd = () => setDraggedId(null);

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

  return (
    <div className="w-[90%] mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
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
          onClick={() => setIsNewCategoryOpen(true)}
        >
          + New Category
        </button>
      </div>
      <div className="rounded-2xl border border-blue-100/60 shadow-sm bg-white overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#F4F9FF] to-[#FAFCFF] text-xs uppercase tracking-wide text-gray-500">
              <th className="w-12"></th>
              <th className="text-left px-6 py-4 font-semibold">ID</th>
              <th className="text-left px-6 py-4 font-semibold">Name</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
              <th className="text-left px-6 py-4 font-semibold">Created At</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr
                key={category.id}
                draggable
                onDragStart={() => onDragStart(category.id)}
                onDragOver={(e) => onDragOver(e, category.id)}
                onDragEnd={onDragEnd}
                className="group transition-all duration-200 hover:bg-[#F8FBFF] cursor-move"
              >
                <td className="text-center align-middle px-4 py-4">
                  <FaGripLines className="text-gray-300 group-hover:text-[#2B60EA] transition-colors text-lg" />
                </td>

                <td className="px-6 py-4 font-semibold text-gray-800">{category.id}</td>

                <td className="px-6 py-4 text-gray-700 font-medium">{category.name}</td>

                <td className="px-6 py-4">
                  <StatusBadge status={category.isActive ? 'active' : 'inactive'} />
                </td>

                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 relative">
                  <button
                    type="button"
                    className="menu-button p-2 rounded-xl transition-all duration-200 hover:bg-[#EAF3FF] hover:text-[#2B60EA] focus:outline-none focus:ring-2 focus:ring-[#2B60EA]/30"
                    onClick={() => setOpenMenuId(openMenuId === category.id ? null : category.id)}
                  >
                    <SlidersHorizontal className="w-5 h-5 text-gray-500 group-hover:text-[#2B60EA] transition-colors" />
                  </button>

                  {openMenuId === category.id && (
                    <div className="menu-dropdown absolute right-0 mt-3 w-44 bg-white border border-blue-100 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-[#F4F9FF] hover:text-[#2B60EA] transition-colors"
                        onClick={() => {
                          router.push(`/admin/articles/categories/view?id=${category.id}`);
                          setOpenMenuId(null);
                        }}
                      >
                        <GrView size={16} />
                        View
                      </button>

                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-[#F4F9FF] hover:text-[#2B60EA] transition-colors"
                        onClick={() => {
                          setOpenMenuId(null);
                        }}
                      >
                        <MdOutlineArticle size={16} />
                        Articles
                      </button>

                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-[#F4F9FF] hover:text-[#2B60EA] transition-colors"
                        onClick={() => {
                          changeStatus(category.id);
                          setOpenMenuId(null);
                        }}
                      >
                        <TbStatusChange size={16} />
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
