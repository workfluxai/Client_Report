// components/Layout.js
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="font-poppins text-gray-900 min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 sticky top-0 bg-white shadow z-50">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" alt="WorkfluxAI" className="h-16 md:h-32 w-auto" />

        </div>

        {/* Navigation */}
        <nav className="space-x-4 md:space-x-8 font-medium text-blue-700">
          <Link href="/#features" className="hover:text-[#42B883]">Features</Link>
          <Link href="/#pricing" className="hover:text-[#42B883]">Pricing</Link>
          <Link href="/signup" className="hover:text-[#42B883]">Sign Up</Link>
          <Link href="/login" className="hover:text-[#42B883]">Login</Link>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="py-6 bg-slate-50 text-blue-700 text-center">
        <p>© {new Date().getFullYear()} WorkfluxAi · Automating client updates since 2025</p>
      </footer>
    </div>
  )
}