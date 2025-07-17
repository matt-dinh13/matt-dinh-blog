import Link from 'next/link';
import Tooltip from './Tooltip';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 overflow-hidden">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center min-w-0 flex-shrink">
            {item.href ? (
              <Tooltip content={item.label}>
                <Link 
                  href={item.href} 
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                >
                  {item.label}
                </Link>
              </Tooltip>
            ) : (
              <Tooltip content={item.label}>
                <span className="font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                  {item.label}
                </span>
              </Tooltip>
            )}
            {idx < items.length - 1 && (
              <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 