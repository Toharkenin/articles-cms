'use client';

import { Button } from '@/components/ui/button';
import { Table, TableColumn, TableAction } from '@/components/admin/table';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GrView } from 'react-icons/gr';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';

type Author = {
  id: number;
  name: string;
  email: string;
  role: string;
  articlesCount?: number;
  createdAt: Date | string;
};

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'site_editor',
      articlesCount: 15,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'author',
      articlesCount: 23,
      createdAt: new Date('2024-02-20'),
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'super_admin',
      articlesCount: 8,
      createdAt: new Date('2024-03-10'),
    },
  ]);

  // Define table columns
  const columns: TableColumn<Author>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (author) => <span className="font-semibold text-gray-800">{author.id}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (author) => <span className="text-gray-700 font-medium">{author.name}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (author) => <span className="text-gray-600">{author.email}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      render: (author) => {
        const roleLabels: Record<string, string> = {
          super_admin: 'Super Admin',
          site_editor: 'Site Editor',
          section_editor: 'Section Editor',
          author: 'Author',
        };
        return <span className="text-gray-700">{roleLabels[author.role] || author.role}</span>;
      },
    },
    {
      key: 'articlesCount',
      label: 'Articles',
      render: (author) => <span className="text-gray-700">{author.articlesCount || 0}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (author) => (
        <span className="text-gray-500 text-sm">
          {new Date(author.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Author>[] = [
    {
      label: 'View',
      icon: <GrView size={16} />,
      onClick: (author) => {
        console.log('View author:', author.id);
      },
    },
    {
      label: 'Edit',
      icon: <MdOutlineEdit size={16} />,
      onClick: (author) => {
        console.log('Edit author:', author.id);
      },
    },
    {
      label: 'Delete',
      icon: <MdDeleteOutline size={16} />,
      onClick: (author) => {
        setAuthors((prev) => prev.filter((a) => a.id !== author.id));
      },
      className: 'text-red-600 hover:bg-red-50',
    },
  ];

  return (
    <div className="w-[90%] mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Authors</h1>
        <Button onClick={() => router.push('/admin/authors/new')}>+ New Author</Button>
      </div>

      <Table
        columns={columns}
        data={authors}
        actions={actions}
        getRowKey={(author) => author.id}
        emptyMessage="No authors available"
      />
    </div>
  );
}
