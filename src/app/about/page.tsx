import { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About | Matt Dinh',
  description: 'Learn more about Matt Dinh - software engineer, business analyst, and technology enthusiast.',
}

export default function AboutPage() {
  return <AboutClient />
} 