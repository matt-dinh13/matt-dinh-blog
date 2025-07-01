import { Metadata } from 'next'
import AboutMeClient from './AboutMeClient'

export const metadata: Metadata = {
  title: 'About Me Management | Admin',
  description: 'Manage your about me page content with rich text editor and markdown support.',
}

export default function AdminAboutMePage() {
  return <AboutMeClient />
} 