import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default async function AdminPortfolioEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={cardTextColor}>Edit Portfolio Project</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" style={cardTextColor}>
          <p className="mb-4">(Rich text editor coming soon...)</p>
          <input type="text" placeholder="Project Title" className="w-full mb-4 px-3 py-2 border rounded" defaultValue={`Project #${id}`} />
          <textarea placeholder="Project Description" className="w-full mb-4 px-3 py-2 border rounded" rows={3} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Save</button>
        </div>
      </main>
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  )
} 