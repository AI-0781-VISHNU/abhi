'use client'

import React from 'react'
import Link from 'next/link'
import { Microscope, Activity, Database, Info, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass bg-slate-950/20"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-2 rounded-lg medical-gradient group-hover:scale-110 transition-transform">
          <Microscope className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          CellVision AI
        </span>
      </Link>
      
      <div className="flex items-center gap-8">
        <NavLink href="/" icon={<Activity className="w-4 h-4" />} label="Home" />
        <NavLink href="/live-analysis" icon={<Microscope className="w-4 h-4" />} label="Scanner" />
        <NavLink href="/database" icon={<Database className="w-4 h-4" />} label="History" />
        <NavLink href="/developer" icon={<Shield className="w-4 h-4" />} label="Dev" />
        <NavLink href="/about" icon={<Info className="w-4 h-4" />} label="Help" />
      </div>

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
