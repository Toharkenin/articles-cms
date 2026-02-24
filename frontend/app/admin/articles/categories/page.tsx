'use client';

import { useState } from 'react';
import { FaGripLines } from 'react-icons/fa';

// Dummy data for categories
const initialCategories = [
  { id: 1, name: 'General' },
  { id: 2, name: 'Technology' },
  { id: 3, name: 'Health' },
  { id: 4, name: 'Business' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [draggedId, setDraggedId] = useState<number | null>(null);

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

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <table className="w-full border rounded-xl overflow-hidden bg-white">
        <thead>
          <tr className="bg-slate-100">
            <th className="w-12"></th>
            <th className="text-left px-4 py-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr
              key={cat.id}
              draggable
              onDragStart={() => onDragStart(cat.id)}
              onDragOver={(e) => onDragOver(e, cat.id)}
              onDragEnd={onDragEnd}
              className="border-b last:border-b-0 hover:bg-slate-50 cursor-move"
            >
              <td className="text-center align-middle px-2">
                <FaGripLines className="text-slate-400 text-xl" />
              </td>
              <td className="px-4 py-3">{cat.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
