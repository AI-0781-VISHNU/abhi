'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Disc, Shield, Zap } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 fill-cyan-400" />
            <span>AI Health Checker</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Check Your <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Health</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Use our smart AI tool to quickly scan cell pictures and find health issues early.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link href="/live-analysis" className="group flex items-center gap-2 px-8 py-4 rounded-xl medical-gradient text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all">
              Try Scanner Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats/Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
          >
            <FeatureCard 
              icon={<Disc className="text-cyan-400" />} 
              title="Super Accurate" 
              desc="Our AI finds tiny details that help detect issues early." 
            />
            <FeatureCard 
              icon={<Shield className="text-emerald-400" />} 
              title="Trusted Data" 
              desc="We use information from top cancer research centers." 
            />
            <FeatureCard 
              icon={<Activity className="text-rose-400" />} 
              title="Fast Results" 
              desc="Get your health scan results in just a few seconds." 
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl glass-card text-left">
    <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center mb-4 border border-slate-800">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
)

import { Activity } from 'lucide-react'

export default Hero
