'use client';

import { Button } from '@/components/ui/button';
import { Table, TableColumn, TableAction } from '@/components/admin/table';
import { TableFilter, FilterField, FilterValues } from '@/components/admin/table-filter';
import { filterData } from '@/components/admin/table-filter-utils';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GrView } from 'react-icons/gr';
import { MdOutlineEdit, MdBlock, MdCheckCircle } from 'react-icons/md';
import { changeAdminStatus, getAdmins } from '@/services/auth';

type Author = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status?: string;
};

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({});

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

  // Define filter fields
  const filterFields: FilterField[] = [
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'site_editor', label: 'Site Editor' },
        { value: 'section_editor', label: 'Section Editor' },
        { value: 'author', label: 'Author' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'blocked', label: 'Blocked' },
      ],
    },
  ];

  // Filter authors based on current filters
  const filteredAuthors = useMemo(() => {
    return filterData(authors, filters, ['firstName', 'lastName', 'email'], {
      role: (author, filterValue) => author.role === filterValue,
      status: (author, filterValue) => (author.status || 'active') === filterValue,
    });
  }, [authors, filters]);

  const handleBlockAdmin = async (author: Author) => {
    try {
      const newStatus = author.status === 'active' ? 'blocked' : 'active';
      const response = await changeAdminStatus(author.id, newStatus);
      if (response.success) {
        // Update the status in the local state
        setAuthors((prev) =>
          prev.map((a) => (a.id === author.id ? { ...a, status: newStatus } : a))
        );
      } else {
        console.error('Error changing admin status:', response.message);
      }
    } catch (error) {
      console.error('Error changing admin status:', error);
    }
  };

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
    {
      key: 'status',
      label: 'Status',
      render: (author) => {
        const status = author.status || 'active';
        const isActive = status === 'active';
        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Active' : 'Blocked'}
          </span>
        );
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
      label: (author) => (author.status === 'blocked' ? 'Unblock' : 'Block'),
      icon: (author) =>
        author.status === 'blocked' ? <MdCheckCircle size={16} /> : <MdBlock size={16} />,
      onClick: handleBlockAdmin,
      className: (author) =>
        author.status === 'blocked'
          ? 'text-green-600 hover:bg-green-50'
          : 'text-red-600 hover:bg-red-50',
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

      <TableFilter filters={filterFields} onFilterChange={setFilters} initialValues={filters} />

      <Table
        columns={columns}
        data={filteredAuthors}
        actions={actions}
        getRowKey={(author) => author.id}
        emptyMessage="No authors found matching your filters"
      />
    </div>
  );
}
