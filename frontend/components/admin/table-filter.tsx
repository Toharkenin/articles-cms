'use client';

import { useState } from 'react';
import { VscSearch, VscFilter, VscClose } from 'react-icons/vsc';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface FilterValues {
  [key: string]: string | { from: string; to: string };
}

interface TableFilterProps {
  filters: FilterField[];
  onFilterChange: (filters: FilterValues) => void;
  initialValues?: FilterValues;
  className?: string;
}

export function TableFilter({
  filters,
  onFilterChange,
  initialValues = {},
  className = '',
}: TableFilterProps) {
  const [filterValues, setFilterValues] = useState<FilterValues>(initialValues);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (key: string, value: string | { from: string; to: string }) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const newFilters = { ...filterValues, search: value };
    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilterValues({});
    setSearchQuery('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filterValues).some(
    (key) => key !== 'search' && filterValues[key]
  );

  const activeFilterCount = Object.keys(filterValues).filter(
    (key) => key !== 'search' && filterValues[key]
  ).length;

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 mb-4 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <VscSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter Toggle Button */}
        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              isExpanded || hasActiveFilters
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <VscFilter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Clear Filters Button */}
        {(hasActiveFilters || searchQuery) && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2.5 rounded-xl font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <VscClose className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Expanded Filter Fields */}
      {isExpanded && filters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5">{filter.label}</label>

              {filter.type === 'text' && (
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  value={(filterValues[filter.key] as string) || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              )}

              {filter.type === 'select' && (
                <select
                  value={(filterValues[filter.key] as string) || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">All</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === 'date' && (
                <input
                  type="date"
                  value={(filterValues[filter.key] as string) || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              )}

              {filter.type === 'dateRange' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    placeholder="From"
                    value={
                      ((filterValues[filter.key] as { from: string; to: string })
                        ?.from as string) || ''
                    }
                    onChange={(e) => {
                      const current = (filterValues[filter.key] as {
                        from: string;
                        to: string;
                      }) || {
                        from: '',
                        to: '',
                      };
                      handleFilterChange(filter.key, { ...current, from: e.target.value });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="date"
                    placeholder="To"
                    value={
                      ((filterValues[filter.key] as { from: string; to: string })?.to as string) ||
                      ''
                    }
                    onChange={(e) => {
                      const current = (filterValues[filter.key] as {
                        from: string;
                        to: string;
                      }) || {
                        from: '',
                        to: '',
                      };
                      handleFilterChange(filter.key, { ...current, to: e.target.value });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
