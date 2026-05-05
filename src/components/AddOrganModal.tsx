'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, PlusCircle, Thermometer, Database } from 'lucide-react'

interface AddOrganModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const AddOrganModal = ({ isOpen, onClose, onSuccess }: AddOrganModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    normalCellType: '',
    cancerType: '',
    description: '',
    normalMetrics: {
      avgArea: 400,
      avgNuclearArea: 40,
      avgPerimeter: 70,
      avgCircularity: 0.85,
      avgDensity: 120
    },
    cancerMetrics: {
      avgArea: 800,
      avgNuclearArea: 200,
      avgPerimeter: 140,
      avgCircularity: 0.45,
      avgDensity: 400
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/organs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error adding organ:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass p-4 sm:p-8 rounded-3xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg medical-gradient">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Body Part</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Organ Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. Pancreas"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Description</label>
                  <input
                    required
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Brief description of the organ..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Normal Cell Type</label>
                  <input
                    required
                    type="text"
                    value={formData.normalCellType}
                    onChange={e => setFormData({ ...formData, normalCellType: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. Acinar cells"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-100/70 ml-1">Cancer Pathology</label>
                  <input
                    required
                    type="text"
                    value={formData.cancerType}
                    onChange={e => setFormData({ ...formData, cancerType: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                    placeholder="e.g. Pancreatic Adenocarcinoma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
                {/* Normal Metrics */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-cyan-400">
                    <Thermometer className="w-4 h-4" /> Healthy Cell Data
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricInput 
                      label="Avg Area" 
                      value={formData.normalMetrics.avgArea} 
                      onChange={val => setFormData({ ...formData, normalMetrics: { ...formData.normalMetrics, avgArea: val }})} 
                    />
                    <MetricInput 
                      label="Nuclear Area" 
                      value={formData.normalMetrics.avgNuclearArea} 
                      onChange={val => setFormData({ ...formData, normalMetrics: { ...formData.normalMetrics, avgNuclearArea: val }})} 
                    />
                    <MetricInput 
                      label="Perimeter" 
                      value={formData.normalMetrics.avgPerimeter} 
                      onChange={val => setFormData({ ...formData, normalMetrics: { ...formData.normalMetrics, avgPerimeter: val }})} 
                    />
                    <MetricInput 
                      label="Circularity" 
                      value={formData.normalMetrics.avgCircularity} 
                      step={0.01}
                      onChange={val => setFormData({ ...formData, normalMetrics: { ...formData.normalMetrics, avgCircularity: val }})} 
                    />
                  </div>
                </div>

                {/* Cancer Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-rose-500">
                    <PlusCircle className="w-4 h-4" /> Cancer Cell Data
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricInput 
                      label="Avg Area" 
                      value={formData.cancerMetrics.avgArea} 
                      onChange={val => setFormData({ ...formData, cancerMetrics: { ...formData.cancerMetrics, avgArea: val }})} 
                    />
                    <MetricInput 
                      label="Nuclear Area" 
                      value={formData.cancerMetrics.avgNuclearArea} 
                      onChange={val => setFormData({ ...formData, cancerMetrics: { ...formData.cancerMetrics, avgNuclearArea: val }})} 
                    />
                    <MetricInput 
                      label="Perimeter" 
                      value={formData.cancerMetrics.avgPerimeter} 
                      onChange={val => setFormData({ ...formData, cancerMetrics: { ...formData.cancerMetrics, avgPerimeter: val }})} 
                    />
                    <MetricInput 
                      label="Circularity" 
                      value={formData.cancerMetrics.avgCircularity} 
                      step={0.01}
                      onChange={val => setFormData({ ...formData, cancerMetrics: { ...formData.cancerMetrics, avgCircularity: val }})} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl hover:bg-slate-800 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl medical-gradient text-white font-bold shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Organ Data
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const MetricInput = ({ label, value, onChange, step = 1 }: { label: string, value: number, onChange: (val: number) => void, step?: number }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">{label}</label>
    <input
      type="number"
      step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 text-sm"
    />
  </div>
)

export default AddOrganModal
