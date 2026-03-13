import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import OrganDashboard from '@/components/OrganDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <OrganDashboard />
      
      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 font-sans">
        <div className="container mx-auto px-8 text-center text-slate-500 text-sm">
          <p>© 2026 CellVision AI. Advanced Digital Pathology Imaging Project.</p>
        </div>
      </footer>
    </main>
  )
}
