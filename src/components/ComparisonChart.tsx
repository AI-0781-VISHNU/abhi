'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Metric {
  avgArea: number
  avgNuclearArea: number
  avgPerimeter: number
  avgCircularity: number
  avgDensity: number
  isCancer: boolean
}

const ComparisonChart = ({ metrics }: { metrics: Metric[] }) => {
  const normal = metrics.find(m => !m.isCancer)
  const cancer = metrics.find(m => m.isCancer)

  if (!normal || !cancer) return null

  const data = [
    { name: 'Cell Area', normal: normal.avgArea, cancer: cancer.avgArea },
    { name: 'Nuclear Area', normal: normal.avgNuclearArea, cancer: cancer.avgNuclearArea },
    { name: 'Perimeter', normal: normal.avgPerimeter, cancer: cancer.avgPerimeter },
    { name: 'Circularity', normal: normal.avgCircularity * 1000, cancer: cancer.avgCircularity * 1000, label: 'Circularity (x1000)' },
    { name: 'Cell Density', normal: normal.avgDensity, cancer: cancer.avgDensity },
  ]

  return (
    <div className="w-full h-[400px] glass p-6 rounded-3xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#f8fafc'
            }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="normal" name="Normal Cells" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cancer" name="Cancer Cells" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ComparisonChart
