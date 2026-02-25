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
        name: 'Categories',
        href: '/admin/articles/categories',
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
    <aside className="w-64 bg-[#F3F6F9] border-r border-blue-100/60 min-h-screen flex flex-col">
      <nav className="flex-1 p-4 pt-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            if (item.name === 'Articles') {
              const isDropdownActive = pathname?.startsWith('/admin/articles');

              return (
                <div key="articles">
                  <button
                    type="button"
                    className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-all duration-200
                    ${
                      isDropdownActive
                        ? 'bg-gradient-to-r from-[#EAF3FF] to-[#F4F9FF] text-[#2B60EA] shadow-sm ring-1 ring-blue-200/50'
                        : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#2B60EA]'
                    }
                  `}
                    onClick={() => setArticlesOpen((open) => !open)}
                  >
                    <span
                      className={`
                      transition-colors
                      ${isDropdownActive ? 'text-[#2B60EA]' : 'text-gray-400 group-hover:text-[#2B60EA]'}
                    `}
                    >
                      {item.icon}
                    </span>

                    {item.name}

                    <svg
                      className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                        articlesOpen
                          ? 'rotate-90 text-[#2B60EA]'
                          : 'text-gray-400 group-hover:text-[#2B60EA]'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <div
                    className={`
                    overflow-hidden transition-all duration-300
                    ${articlesOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}
                  `}
                  >
                    <div className="ml-6 space-y-1 border-l border-blue-100 pl-4">
                      {item.children?.map((child) => {
                        const isActive = pathname === child.href;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`
                            block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                              isActive
                                ? 'bg-[#2B60EA]/10 text-[#2B60EA] shadow-sm'
                                : 'text-gray-500 hover:bg-white hover:text-[#2B60EA]'
                            }
                          `}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            if (item.href) {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-[#EAF3FF] to-[#F4F9FF] text-[#2B60EA] shadow-sm ring-1 ring-blue-200/50'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#2B60EA]'
                  }
                `}
                >
                  <span
                    className={`
                    transition-colors
                    ${isActive ? 'text-[#2B60EA]' : 'text-gray-400 group-hover:text-[#2B60EA]'}
                  `}
                  >
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
    </aside>
  );
}
