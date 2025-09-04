import { Metadata } from 'next'
import PortfolioListClient from './PortfolioListClient'

export const metadata: Metadata = {
  title: 'Portfolio | Matt Dinh',
  description: 'Explore my projects and work in software development and business analysis.',
}

export default function PortfolioListPage() {
  return <PortfolioListClient />
} 