'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { Shield, Microscope, Activity, HelpCircle, FileText, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  const steps = [
    {
      icon: <Microscope className="w-6 h-6 text-cyan-400" />,
      title: "1. Select Organ",
      desc: "Pick the specific body part you want to analyze from the dashboard (e.g., Lung, Breast)."
    },
    {
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      title: "2. Scan or Upload",
      desc: "Use the live camera or upload a microscopic slide image. Ensure the image is clear and focused."
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-400" />,
      title: "3. Get Results",
      desc: "Our AI extracts cell metrics and compares them against healthy patterns to generate a report."
    }
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-sm font-bold mb-6"
            >
              <HelpCircle className="w-4 h-4" />
              Help & Documentation
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black mb-6"
            >
              How to use <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">CellVision AI</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg sm:text-xl"
            >
              Everything you need to know about our AI-powered pathology scanner.
            </motion.p>
          </div>

          {/* Quick Start Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-8 rounded-3xl glass border-slate-800"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Info */}
          <div className="space-y-12">
            <section className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-cyan-400" />
                Understanding Cell Metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-white uppercase text-xs tracking-widest text-slate-500">Avg Area</h3>
                  <p className="text-sm text-slate-400 italic">Measures the total surface area of identified cells. Cancerous cells often vary significantly in size.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-white uppercase text-xs tracking-widest text-slate-500">Nuclear Area</h3>
                  <p className="text-sm text-slate-400 italic">Measures the size of the nucleus. Large or irregular nuclei are strong indicators of malignancy.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-white uppercase text-xs tracking-widest text-slate-500">Circularity</h3>
                  <p className="text-sm text-slate-400 italic">Measures how round the cell is. Normal cells are usually quite round, while cancer cells are often irregular.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-white uppercase text-xs tracking-widest text-slate-500">Density</h3>
                  <p className="text-sm text-slate-400 italic">Shows how many cells are present in a specific area. Higher density can suggest rapid cell growth.</p>
                </div>
              </div>
            </section>

            <section className="text-center p-12 rounded-3xl medical-gradient">
              <h2 className="text-3xl font-black text-white mb-4">Ready to start?</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">Head over to the health scanner and perform your first digital biopsy analysis.</p>
              <a 
                href="/live-analysis"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:shadow-xl transition-all"
              >
                Go to Health Scanner
                <CheckCircle2 className="w-5 h-5" />
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
