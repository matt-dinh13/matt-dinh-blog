import { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog | Matt Dinh',
  description: 'Read my latest articles about software development, business analysis, and career insights.',
}

export default function BlogListPage() {
  return <BlogListClient />
} 