import { Clock } from 'lucide-react';
import { calculateReadingTime, formatReadingTime } from '@/lib/utils';

interface ReadingTimeProps {
  content: string;
  languageCode: string;
  className?: string;
}

export default function ReadingTime({ content, languageCode, className = '' }: ReadingTimeProps) {
  const readingTime = calculateReadingTime(content, languageCode);
  const formattedTime = formatReadingTime(readingTime, languageCode);

  return (
    <div className={`flex items-center space-x-1 text-sm font-medium ${className}`}>
      <Clock size={14} className="text-gray-600 dark:text-gray-400" />
      <span className="text-gray-700 dark:text-gray-300 font-semibold">
        {formattedTime}
      </span>
    </div>
  );
} 