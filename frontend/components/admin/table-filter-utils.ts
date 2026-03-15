import { FilterValues } from './table-filter';

/**
 * Utility function to filter an array of items based on filter values
 * @param data - Array of items to filter
 * @param filters - Object containing filter values
 * @param searchFields - Array of field keys to search in (for the search filter)
 * @param customFilters - Optional custom filter functions for specific fields
 */
export function filterData<T extends Record<string, any>>(
  data: T[],
  filters: FilterValues,
  searchFields: (keyof T)[],
  customFilters?: {
    [key: string]: (item: T, filterValue: string | { from: string; to: string }) => boolean;
  }
): T[] {
  return data.filter((item) => {
    // Apply search filter
    if (filters.search) {
      const searchTerm = (filters.search as string).toLowerCase();
      const matchesSearch = searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm);
      });
      if (!matchesSearch) return false;
    }

    // Apply other filters
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'search' || !value) continue;

      // Use custom filter if provided
      if (customFilters && customFilters[key]) {
        if (!customFilters[key](item, value)) return false;
        continue;
      }

      // Handle date range filter
      if (typeof value === 'object' && 'from' in value && 'to' in value) {
        const dateValue = new Date(item[key]);
        if (value.from) {
          const fromDate = new Date(value.from);
          if (dateValue < fromDate) return false;
        }
        if (value.to) {
          const toDate = new Date(value.to);
          if (dateValue > toDate) return false;
        }
        continue;
      }

      // Handle simple string filters
      if (typeof value === 'string') {
        const itemValue = String(item[key] || '').toLowerCase();
        const filterValue = value.toLowerCase();
        if (!itemValue.includes(filterValue)) return false;
      }
    }

    return true;
  });
}

/**
 * Debounce function to delay execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
