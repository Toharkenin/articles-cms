import React from "react";
import { LuSearch } from "react-icons/lu";


const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex flex-col leading-tight">
          <span className="text-2xl font-serif font-bold tracking-wide text-gray-800">
            Jeo Politics
          </span>
          <span className="text-[11px] tracking-[0.35em] text-gray-500">
            GLOBAL AFFAIRS
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          <a href="/" className="hover:text-black">Home</a>
          <a href="#" className="hover:text-black">Middle East</a>
          <a href="#" className="hover:text-black">Israel</a>
          <a href="#" className="hover:text-black">U.S. Policy</a>
          <a href="#" className="hover:text-black">Analysis</a>
          <a href="#" className="hover:text-black">Opinion</a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="text-gray-600 hover:text-black text-lg">
            <LuSearch />
          </button>

          {/* Subscribe */}
          <button className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition">
            Subscribe
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
