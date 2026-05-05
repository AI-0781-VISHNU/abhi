'use client'

import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#22d3ee"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}
