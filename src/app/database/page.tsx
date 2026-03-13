'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Trash2, ExternalLink, Filter, Search } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface CellMetric {
  id: string
  organId: string
  isCancer: boolean
  avgArea: number
  avgNuclearArea: number
  avgPerimeter: number
  avgCircularity: number
  avgDensity: number
  createdAt: string
  updatedAt: string
}

interface Organ {
  id: string
  name: string
  normalCellType: string
  cancerType: string
  metrics: CellMetric[]
}

const DatabasePage = () => {
  const [organs, setOrgans] = useState<Organ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchOrgans = async () => {
    try {
      const res = await fetch('/api/organs')
      const data = await res.json()
      setOrgans(data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrgans()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) return
    
    try {
      const res = await fetch(`/api/organs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchOrgans()
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const filteredOrgans = organs.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.cancerType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <div className="container mx-auto px-8 pt-32">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg medical-gradient">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Health Records</h1>
            </div>
            <p className="text-slate-400">View and manage your saved scan results.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search organs or types..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
            <button className="p-3 rounded-xl glass border-slate-700 hover:border-slate-500 transition-all">
              <Filter className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Body Part</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Condition</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Healthy Cell Data</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Cancer Cell Data</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500 mb-4" />
                    <p className="text-slate-500">Loading your history...</p>
                  </td>
                </tr>
              ) : filteredOrgans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                    No records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredOrgans.map((organ) => {
                  const normal = organ.metrics.find(m => !m.isCancer)
                  const cancer = organ.metrics.find(m => m.isCancer)
                  return (
                    <motion.tr 
                      key={organ.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-lg">{organ.name}</span>
                          <span className="text-xs text-slate-500 font-medium">{organ.normalCellType}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                          {organ.cancerType}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-400">Size: {normal?.avgArea} μm²</span>
                          <span className="text-xs text-slate-400">Nucleus: {normal?.avgNuclearArea} μm²</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-rose-400/80">Size: {cancer?.avgArea} μm²</span>
                          <span className="text-xs text-rose-400/80">Nucleus: {cancer?.avgNuclearArea} μm²</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/organ/${organ.id}`}
                            className="p-2 rounded-lg hover:bg-cyan-500/10 text-cyan-400 transition-colors"
                            title="View Analysis"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(organ.id)}
                            className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default DatabasePage
