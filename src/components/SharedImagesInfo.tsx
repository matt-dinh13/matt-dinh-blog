import React from 'react'

interface SharedImagesInfoProps {
  blogPostId?: number
}

export default function SharedImagesInfo({ blogPostId }: SharedImagesInfoProps) {
  if (!blogPostId) {
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Shared Images Feature
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                <strong>New Feature:</strong> Images uploaded in one language will automatically appear in all language translations of this article.
              </p>
              <p className="mt-1">
                This saves storage space and ensures consistency across languages. Available after saving the post.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Shared Images Active
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>
              Images uploaded in this editor will automatically sync across all language translations of this article.
            </p>
            <p className="mt-1">
              This ensures consistency and saves storage space by avoiding duplicate uploads.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 