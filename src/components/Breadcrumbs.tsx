import Link from 'next/link';

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
      <ol className="flex flex-wrap items-center space-x-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-700 dark:text-gray-200">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
} 