import { Loader2 } from 'lucide-react'

interface LoadMoreButtonProps {
  loading: boolean
  onLoadMore: () => void
  language: string
  text?: {
    loading?: string
    default?: string
  }
}

export function LoadMoreButton({ 
  loading, 
  onLoadMore, 
  language, 
  text 
}: LoadMoreButtonProps) {
  const defaultText = {
    loading: language === 'vi' ? 'Đang tải...' : 'Loading...',
    default: language === 'vi' ? 'Tải thêm bài viết' : 'Load More Posts'
  }

  const buttonText = {
    loading: text?.loading || defaultText.loading,
    default: text?.default || defaultText.default
  }

  return (
    <div className="mt-8 text-center">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            {buttonText.loading}
          </>
        ) : (
          buttonText.default
        )}
      </button>
    </div>
  )
} 