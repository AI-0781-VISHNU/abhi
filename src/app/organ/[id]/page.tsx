'use client'

import React, { useEffect, useState } from 'react'
import { ArrowLeft, Info, Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ComparisonChart from '@/components/ComparisonChart'
import Image from 'next/image'

interface Metric {
  id: string
  isCancer: boolean
  avgArea: number
  avgNuclearArea: number
  avgPerimeter: number
  avgCircularity: number
  avgDensity: number
}

interface ImageType {
  id: string
  url: string
  isCancer: boolean
  label: string | null
}

interface Organ {
  id: string
  name: string
  normalCellType: string
  cancerType: string
  description: string
  metrics: Metric[]
  images: ImageType[]
}

const OrganPage = ({ params }: { params: { id: string } }) => {
  const [organ, setOrgan] = useState<Organ | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/organs/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setOrgan(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  )

  if (!organ) return <div>Organ not found</div>

  const normalMetrics = organ.metrics.find(m => !m.isCancer)
  const cancerMetrics = organ.metrics.find(m => m.isCancer)
  
  const normalImage = organ.images.find(img => !img.isCancer)
  const cancerImage = organ.images.find(img => img.isCancer)

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <div className="container mx-auto px-8 pt-32">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-5xl font-bold tracking-tight">{organ.name} <span className="text-slate-500 font-light">Analysis</span></h1>
              <div className="px-3 py-1 rounded-full glass border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
                Critical Review
              </div>
            </div>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              {organ.description}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl glass-card">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Tissue Source</span>
                <span className="text-lg font-semibold text-white">{organ.normalCellType}</span>
              </div>
              <div className="p-6 rounded-2xl glass-card">
                <span className="text-xs font-bold text-rose-500/70 uppercase tracking-widest block mb-1">Pathology</span>
                <span className="text-lg font-semibold text-rose-400">{organ.cancerType}</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex flex-col gap-4">
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl medical-gradient text-white font-bold shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 transition-all">
              <Download className="w-4 h-4" />
              Export Dataset
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl glass border-slate-700 text-white font-bold hover:bg-slate-800/50 transition-all">
              <Share2 className="w-4 h-4" />
              Share Analysis
            </button>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Normal View */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                Normal Morphology
              </h3>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Magnification: 400x</span>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden glass border-cyan-500/20">
               <Image 
                src={normalImage?.url || "/images/breast_normal.png"} 
                alt="Normal Cells"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                <div>
                  <p className="text-sm font-medium text-white mb-1">{normalImage?.label || "Healthy Epithelial Array"}</p>
                  <p className="text-xs text-slate-400">Consistent cell sizing and polarized nuclear placement.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Avg Area" value={`${normalMetrics?.avgArea ?? 0} μm²`} />
              <StatBox label="Nuclear Area" value={`${normalMetrics?.avgNuclearArea ?? 0} μm²`} />
              <StatBox label="Circularity" value={(normalMetrics?.avgCircularity ?? 0).toFixed(2)} />
            </div>
          </div>

          {/* Cancer View */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2 text-rose-500">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                Malignant Morphology
              </h3>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Magnification: 400x</span>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden glass border-rose-500/20">
              <Image 
                src={cancerImage?.url || "/images/breast_cancer.png"} 
                alt="Cancer Cells"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/60 to-transparent flex items-end p-6">
                <div>
                  <p className="text-sm font-medium text-white mb-1">{cancerImage?.label || "Anaplastic Proliferation"}</p>
                  <p className="text-xs text-rose-200/70">Pleomorphic nuclei with irregular borders and chromatin clumping.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Avg Area" value={`${cancerMetrics?.avgArea ?? 0} μm²`} color="text-rose-400" />
              <StatBox label="Nuclear Area" value={`${cancerMetrics?.avgNuclearArea ?? 0} μm²`} color="text-rose-400" />
              <StatBox label="Circularity" value={(cancerMetrics?.avgCircularity ?? 0).toFixed(2)} color="text-rose-400" />
            </div>
          </div>
        </div>

        {/* Data Visualization */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold">Metric Deviation Analysis</h3>
            <div className="h-px flex-1 bg-slate-900" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ComparisonChart metrics={organ.metrics} />
            </div>
            <div className="glass-card p-8 rounded-3xl flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Info className="w-5 h-5 text-orange-500" />
                </div>
                <h4 className="font-bold text-lg text-white">Analysis Summary</h4>
              </div>
              <ul className="space-y-4">
                <SummaryItem 
                  text={`Nuclear-to-Cytoplasmic ratio increased by ${((cancerMetrics?.avgNuclearArea ?? 0) / (cancerMetrics?.avgArea ?? 1) / ((normalMetrics?.avgNuclearArea ?? 0) / (normalMetrics?.avgArea ?? 1))).toFixed(1)}x`} 
                />
                <SummaryItem 
                  text={`Cellular circularity decreased by ${(((normalMetrics?.avgCircularity ?? 0) - (cancerMetrics?.avgCircularity ?? 0)) / (normalMetrics?.avgCircularity ?? 1) * 100).toFixed(0)}% representing irregularity.`} 
                />
                <SummaryItem 
                  text={`Detected a ${((cancerMetrics?.avgDensity ?? 0) / (normalMetrics?.avgDensity ?? 1)).toFixed(1)}x increase in cell populate density within sampled tissue.`} 
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const StatBox = ({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) => (
  <div className="p-4 rounded-xl glass border-slate-800">
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{label}</span>
    <span className={`text-sm font-bold ${color}`}>{value}</span>
  </div>
)

const SummaryItem = ({ text }: { text: string }) => (
  <li className="flex gap-3 text-sm text-slate-400 leading-relaxed">
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
    {text}
  </li>
)

export default OrganPage
