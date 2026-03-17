'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuSearch } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/articles';
import { Button } from '../ui/button';

interface Category {
  id: number;
  name: string;
  slug?: string;
  isActive: boolean;
}

const Header = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          console.warn('No categories returned from API');
        }
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.status,
        });
      }
    };

    fetchCategoriesData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div
        className="w-full flex items-center justify-between px-6 py-4"
        onClick={() => {
          if (isSearchOpen) setIsSearchOpen(false);
          if (isMenuOpen) setIsMenuOpen(false);
        }}
      >
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="xl:hidden text-2xl text-gray-700"
          >
            ☰
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight hover:opacity-80 transition">
            <span className="text-2xl font-serif font-bold tracking-wide text-gray-800">
              Jeo Politics
            </span>
            <span className="text-[11px] tracking-[0.35em] text-gray-500">GLOBAL AFFAIRS</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-8 text-sm">
          <Link href="/" className="hover:text-theme-dark transition">
            Home
          </Link>
          {categories
            .filter((category) => category.isActive)
            .slice(0, 4)
            .map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-theme-dark transition"
              >
                {category.name}
              </Link>
            ))}
          {categories.length === 0 && (
            <span className="text-gray-400 text-xs">Loading categories...</span>
          )}
        </nav>

        <div className="relative flex items-center gap-4">
          <div className="relative w-[40px] h-[40px]">
            {/* Search Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchOpen(true);
              }}
              className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-300
        ${
          isSearchOpen
            ? 'opacity-0 scale-75 rotate-90 pointer-events-none'
            : 'opacity-100 scale-100 rotate-0'
        }
      `}
            >
              <LuSearch className="text-gray-600 text-lg" />
            </button>

            {/* Search Input */}
            <form
              onSubmit={handleSearch}
              onClick={(e) => e.stopPropagation()}
              className={`
        absolute right-0 top-1/2 -translate-y-1/2
        transition-all duration-300 ease-out
        ${
          isSearchOpen
            ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-x-4 pointer-events-none'
        }
      `}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="
                  w-48 sm:w-56 md:w-64 xl:w-72
                  px-4 py-2 pl-10
                  border border-gray-300 rounded-lg
                  bg-white shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  text-sm
                "
                />
                <LuSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </form>
          </div>

          <Button className="bg-theme-red hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
            Subscribe
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={`
    fixed left-4 top-20 z-50
    transition-all duration-300 ease-out
    origin-top-left
    ${
      isMenuOpen
        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
        : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'
    }
  `}
        >
          <div className="w-72 bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                Home
              </Link>

              {categories
                .filter((c) => c.isActive)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:translate-x-1 transition-all duration-200"
                  >
                    {category.name}
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
