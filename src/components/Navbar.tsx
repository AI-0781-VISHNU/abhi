'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Microscope, Activity, Database, Info, Shield, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', icon: <Activity className="w-5 h-5 md:w-4 md:h-4" />, label: 'Home' },
    { href: '/live-analysis', icon: <Microscope className="w-5 h-5 md:w-4 md:h-4" />, label: 'Scanner' },
    { href: '/database', icon: <Database className="w-5 h-5 md:w-4 md:h-4" />, label: 'History' },
    { href: '/developer', icon: <Shield className="w-5 h-5 md:w-4 md:h-4" />, label: 'Dev' },
    { href: '/about', icon: <Info className="w-5 h-5 md:w-4 md:h-4" />, label: 'Help' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between bg-[#020617] border-b border-slate-800 shadow-xl"
    >
      <Link href="/" className="flex items-center gap-3 group z-[101]">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden group-hover:scale-110 transition-transform bg-white/10 flex items-center justify-center p-0.5">
          <img src="/logo.png" alt="CellSight Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-slate-400 bg-clip-text text-transparent">
          CellSight AI
        </span>
      </Link>
      
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-xl glass border-slate-800 text-white z-[101]"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#020617] flex flex-col pt-24 px-8 gap-6 z-[100]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent)]" />
            {navLinks.map((link) => (
              <motion.div 
                key={link.href}
                whileTap={{ scale: 0.98, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className="relative z-10 rounded-xl"
              >
                <Link 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 py-4 border-b border-white/5 text-xl font-bold text-slate-100 w-full"
                >
                  <span className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  )
}

const NavLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <Link href={href} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors group">
    <span className="group-hover:translate-y-[-2px] transition-transform">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
)

export default Navbar
