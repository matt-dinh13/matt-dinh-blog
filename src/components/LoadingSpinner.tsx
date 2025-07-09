interface LoadingSpinnerProps {
  language: string
  message?: string
}

export function LoadingSpinner({ language, message }: LoadingSpinnerProps) {
  const defaultMessage = language === 'vi' ? 'Đang tải bài viết...' : 'Loading posts...'
  
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {message || defaultMessage}
      </p>
    </div>
  )
} 