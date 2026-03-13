'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import AddOrganModal from './AddOrganModal'

interface Metric {
  id: string
  isCancer: boolean
  avgArea: number
  avgNuclearArea: number
  avgPerimeter: number
  avgCircularity: number
  avgDensity: number
}

interface Organ {
  id: string
  name: string
  normalCellType: string
  cancerType: string
  description: string
  metrics: Metric[]
}

const OrganDashboard = () => {
  const [organs, setOrgans] = useState<Organ[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchOrgans = () => {
    fetch('/api/organs')
      .then(res => res.json())
      .then(data => {
        setOrgans(data)
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    fetchOrgans()
  }, [])

  return (
    <section className="py-24 bg-slate-950 font-sans">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Choose Body Part</h2>
            <p className="text-slate-400">Pick a body part to see healthy vs cancer cell data.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border-slate-700 hover:border-cyan-500/50 transition-all text-white font-medium"
          >
            <Plus className="w-5 h-5 text-cyan-400" />
            Add New Organ
          </button>
        </div>

        <AddOrganModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchOrgans} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {organs.map((organ, index) => (
            <motion.div
              key={organ.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 rounded-3xl glass-card overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors" />
              
              <h3 className="text-2xl font-bold text-white mb-2">{organ.name}</h3>
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Normal Cell Type</span>
                <span className="text-sm text-slate-300">{organ.normalCellType}</span>
              </div>
              
              <div className="flex flex-col gap-1 mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-500/70">Cancer Type</span>
                <span className="text-sm text-rose-400 font-medium">{organ.cancerType}</span>
              </div>

              <div className="flex items-center gap-4">
                <Link 
                  href={`/organ/${organ.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl medical-gradient text-white text-sm font-bold shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  View Metrics
                </Link>
                <button className="p-3 rounded-xl glass border-slate-700 hover:text-cyan-400 transition-colors">
                  <BarChart2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrganDashboard
