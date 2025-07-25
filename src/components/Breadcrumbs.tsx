import Link from 'next/link'

interface BreadcrumbsProps {
  items: Array<{ label: string, href?: string }>
  onNavigate?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb" data-testid="admin-breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, idx) => (
          <li key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                onClick={onNavigate}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right text-gray-400" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
} 