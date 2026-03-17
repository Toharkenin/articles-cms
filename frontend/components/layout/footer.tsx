'use client';

import Link from 'next/link';
import { LuTwitter, LuFacebook, LuLinkedin, LuMail } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/articles';

interface Category {
  id: number;
  name: string;
  slug?: string;
  isActive: boolean;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          // Only show active categories
          const activeCategories = data.filter((cat) => cat.isActive);
          setCategories(activeCategories.slice(0, 5)); // Limit to 5 categories
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategoriesData();
  }, []);

  return (
    <footer className="bg-theme-dark text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex flex-col leading-tight mb-4">
              <span className="text-2xl font-serif font-bold text-white">Jeo Politics</span>
              <span className="text-[10px] tracking-[0.35em] text-gray-400">GLOBAL AFFAIRS</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              In-depth analysis and insights on geopolitical developments, regional dynamics, and
              international affairs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/authors" className="hover:text-white transition">
                  Authors
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-white transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm mb-4 text-gray-400">
              Get weekly insights delivered to your inbox.
            </p>
            <div className="flex gap-3 mb-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-theme-blue flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <LuTwitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-theme-blue flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <LuFacebook size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-theme-blue flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <LuLinkedin size={18} />
              </a>
              <a
                href="mailto:contact@jeopolitics.com"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-theme-blue flex items-center justify-center transition"
                aria-label="Email"
              >
                <LuMail size={18} />
              </a>
            </div>
            <Link
              href="#newsletter"
              className="inline-block w-full text-center bg-theme-red hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Subscribe Now
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Jeo Politics. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
