export function ArticleStatusBadge({ status }: { status: 'draft' | 'published' | 'archive' }) {
  const styles =
    status === 'published'
      ? 'bg-green-100 text-green-700'
      : status === 'draft'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-gray-100 text-gray-700';

  const label = status === 'published' ? 'Published' : status === 'draft' ? 'Draft' : 'Archived';

  return <span className={`px-3 py-1 rounded-md text-xs font-semibold ${styles}`}>{label}</span>;
}
