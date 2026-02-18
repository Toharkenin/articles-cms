'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState } from 'react';

const navItems = [
  {
    name: 'Articles',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    children: [
      {
        name: 'List',
        href: '/admin/articles/list',
      },
      {
        name: 'Preview',
        href: '/admin/articles/preview',
      },
    ],
  },
  {
    name: 'Admins',
    href: '/admin/admins',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    name: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];


export default function Sidebar() {
  const pathname = usePathname();
  const [articlesOpen, setArticlesOpen] = useState(false);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <nav className="flex-1 p-4 pt-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            if (item.name === 'Articles') {
              // Dropdown for Articles
              const isDropdownActive = pathname?.startsWith('/admin/articles');
              return (
                <div key="articles">
                  <button
                    type="button"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full transition-colors ${isDropdownActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                    onClick={() => setArticlesOpen((open) => !open)}
                  >
                    <span className={isDropdownActive ? 'text-blue-700' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    {item.name}
                    <svg className={`ml-auto w-4 h-4 transition-transform ${articlesOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {articlesOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children?.map((child) => {
                        const isActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            // Regular nav item (only render if href is defined)
            if (item.href) {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className={isActive ? 'text-blue-700' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            }
            return null;
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
