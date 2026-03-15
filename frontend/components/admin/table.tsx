'use client';

import { ReactNode, useState, useEffect } from 'react';
import { VscSettings } from 'react-icons/vsc';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

export interface TableAction<T> {
  label: string | ((item: T) => string);
  icon?: ReactNode | ((item: T) => ReactNode);
  onClick: (item: T) => void;
  className?: string | ((item: T) => string);
  condition?: (item: T) => boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  getRowKey: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  actions = [],
  getRowKey,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) {
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

  const handleActionsClick = (e: React.MouseEvent, itemKey: string | number) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === itemKey ? null : itemKey);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside the menu dropdown
      if (
        openMenuId !== null &&
        !target.closest('.menu-dropdown') &&
        !target.closest('button[title="More actions"]')
      ) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left font-semibold ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
            {actions.length > 0 && <th className="px-6 py-4 text-left font-semibold">Actions</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="px-6 py-8 text-center text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const rowKey = getRowKey(item, index);
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(item)}
                  className={`hover:bg-gray-50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowKey}-${column.key}`}
                      className={`px-6 py-4 text-gray-700 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(item, index)
                        : String((item as any)[column.key] || '-')}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="px-6 py-4 relative">
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        title="More actions"
                        onClick={(e) => handleActionsClick(e, rowKey)}
                      >
                        <VscSettings className="w-5 h-5 text-gray-600" />
                      </button>

                      {openMenuId === rowKey && (
                        <div className="menu-dropdown absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-20">
                          {actions
                            .filter((action) => !action.condition || action.condition(item))
                            .map((action, actionIndex) => {
                              const label =
                                typeof action.label === 'function'
                                  ? action.label(item)
                                  : action.label;
                              const icon =
                                typeof action.icon === 'function' ? action.icon(item) : action.icon;
                              const className =
                                typeof action.className === 'function'
                                  ? action.className(item)
                                  : action.className;

                              return (
                                <button
                                  key={actionIndex}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                    className || ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(item);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  {icon && (
                                    <span className="inline-block mr-2 align-text-bottom">
                                      {icon}
                                    </span>
                                  )}
                                  {label}
                                </button>
                              );
                            })}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
