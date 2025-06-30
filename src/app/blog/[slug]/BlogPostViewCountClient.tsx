"use client"

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function BlogPostViewCountClient({ postId, initialViewCount }: { postId: string, initialViewCount: number }) {
  const [viewCount, setViewCount] = useState<number>(initialViewCount);

  useEffect(() => {
    const key = `viewed-article-${postId}`;
    if (!localStorage.getItem(key)) {
      fetch('/api/increment-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId })
      })
        .then(async res => {
          try {
            const data = await res.json();
            if (typeof data.view_count === 'number') setViewCount(data.view_count);
          } catch (e) {
            // Handle empty or invalid JSON
            console.error('Failed to parse view count response:', e);
          }
        });
      localStorage.setItem(key, '1');
    }
  }, [postId]);

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
      <Eye size={16} />
      <span>{viewCount}</span>
    </div>
  );
} 