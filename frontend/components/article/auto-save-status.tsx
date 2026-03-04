import { useEffect, useState } from 'react';

function SaveStatus({ lastSavedAt, isSaving }: any) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSavedAt) return;

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
      setTimeAgo(`${diff} seconds ago`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSavedAt]);

  if (isSaving) {
    return <span className="text-sm text-gray-500">Saving...</span>;
  }

  if (!lastSavedAt) {
    return <span className="text-sm text-gray-400">Not saved yet</span>;
  }

  return <span className="text-sm text-green-600">Saved {timeAgo}</span>;
}

export default SaveStatus;
