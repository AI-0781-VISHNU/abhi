'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Shield, Trash2, RefreshCcw, FlaskConical, AlertTriangle, CheckCircle2, Activity } from 'lucide-react'
import Navbar from '@/components/Navbar'

interface Organ {
  id: string
  name: string
  description: string
  cancerType: string
}

interface TraceLog {
  timestamp: string
  organ: string
  logs: string[]
  accuracy: number
  status: string
}

export default function DeveloperDashboard() {
  const [organs, setOrgans] = useState<Organ[]>([])
  const [isResetting, setIsResetting] = useState(false)
  const [message, setMessage] = useState('')
  const [lastTrace, setLastTrace] = useState<TraceLog | null>(null)

  useEffect(() => {
    fetch('/api/organs')
      .then(res => res.json())
      .then(data => setOrgans(data))
      .catch(err => console.error(err))

    // Listen for storage changes
    const checkTrace = () => {
      const stored = localStorage.getItem('lastTrainingTrace')
      if (stored) setLastTrace(JSON.parse(stored))
    }
    
    checkTrace()
    window.addEventListener('storage', checkTrace)
    return () => window.removeEventListener('storage', checkTrace)
  }, [])

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all training data? This cannot be undone.')) return
    
    setIsResetting(true)
    try {
      const res = await fetch('/api/developer/reset', { method: 'POST' })
      if (res.ok) {
          setMessage('Training data and datasets cleared successfully.')
          localStorage.removeItem('lastTrainingTrace')
          setLastTrace(null)
          setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-cyan-400" />
              DEVELOPER <span className="text-cyan-400">CONTROL</span>
            </h1>
            <p className="text-slate-400 font-medium">System administration and data management console</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleReset}
              disabled={isResetting}
              className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              {isResetting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Reset All Training Data
            </button>
          </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3 text-cyan-400 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Database Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/5">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Organ Database ({organs.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-500">ID</th>
                      <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-500">Organ Name</th>
                      <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-500">Pathology</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {organs.map(organ => (
                      <tr key={organ.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 text-xs font-mono text-slate-400">{organ.id}</td>
                        <td className="py-4 text-sm font-bold">{organ.name}</td>
                        <td className="py-4 text-sm text-cyan-400">{organ.cancerType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-cyan-400" />
                  Live System Trace
                </h2>
                {lastTrace && (
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Last trained: {lastTrace.organ} @ {new Date(lastTrace.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 font-mono text-[10px] text-slate-400 h-80 overflow-y-auto custom-scrollbar">
                {!lastTrace ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                    <Database className="w-8 h-8 opacity-20" />
                    <p>Waiting for training session events...</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-cyan-400/80 mb-2">{">>>"} [SESSION_START] Target: {lastTrace.organ}</p>
                    {lastTrace.logs.map((log, i) => (
                      <p key={i} className="flex gap-4">
                        <span className="text-slate-600">[{i}]</span>
                        <span className={log.includes('High') || log.includes('Accuracy') ? 'text-cyan-300' : ''}>{log}</span>
                      </p>
                    ))}
                    <p className="text-emerald-400/80 mt-2">{">>>"} [SESSION_COMPLETE] Accuracy: {lastTrace.accuracy}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-400/20">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Engine Health</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Operational
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Python Version</span>
                  <span className="text-white font-bold">3.12 (OpenCV 4.x)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Latency</span>
                  <span className="text-white font-bold">~650ms</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-400/20">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">System Constraints</h3>
              </div>
              <p className="text-[10px] text-amber-400/80 leading-relaxed mb-4">
                Current session uses transient storage for training datasets. 
                Full system reset will clear all custom models across all user instances.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(20px);
        }
      `}</style>
    </main>
  )
}
