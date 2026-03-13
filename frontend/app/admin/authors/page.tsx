'use client';

import { Button } from '@/components/ui/button';
import { Table, TableColumn, TableAction } from '@/components/admin/table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GrView } from 'react-icons/gr';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { getAdmins } from '@/services/auth';

type Author = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await getAdmins();

        if (response.success && response.admins) {
          console.log('Fetched admins:', response.admins);
          setAuthors(response.admins);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Define table columns
  const columns: TableColumn<Author>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (author, index) => <span className="font-semibold text-gray-800">{index + 1}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (author) => (
        <span className="text-gray-700 font-medium">
          {author.firstName} {author.lastName}
        </span>
      ),
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
  ];

  // Define table actions
  const actions: TableAction<Author>[] = [
    {
      label: 'View',
      icon: <GrView size={16} />,
      onClick: (author) => {
        router.push(`/admin/authors/${author.id}/view`);
      },
    },
    {
      label: 'Edit',
      icon: <MdOutlineEdit size={16} />,
      onClick: (author) => {
        router.push(`/admin/authors/${author.id}/edit`);
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

  if (loading) {
    return (
      <div className="w-[90%] mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading authors...</div>
        </div>
      </div>
    );
  }

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
