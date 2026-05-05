'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Camera as LucideCamera, RefreshCw, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

interface LiveCameraProps {
  onCapture: (imageSrc: string) => void
  isAnalyzing: boolean
  onStop?: () => void
}

const LiveCamera = ({ onCapture, isAnalyzing, onStop }: LiveCameraProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const requestPermissions = async () => {
    try {
      const permissions = await Camera.requestPermissions()
      if (permissions.camera === 'granted') {
        setIsCameraReady(true)
        setError(null)
      }
    } catch (err) {
      console.error("Permission error:", err)
    }
  }

  const takePhoto = async () => {
    try {
      // Force permission check right before opening camera
      const perm = await Camera.requestPermissions()
      if (perm.camera !== 'granted') {
        setError("Please allow camera access in your phone settings to use the scanner.")
        return
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false
      })

      if (image.dataUrl) {
        onCapture(image.dataUrl)
      }
    } catch (err) {
      console.error("Camera error:", err)
    }
  }

  useEffect(() => {
    requestPermissions()
  }, [])

  return (
    <div className="relative w-full aspect-square sm:aspect-video min-h-[450px] sm:min-h-[400px] rounded-3xl overflow-hidden glass border-slate-800 shadow-2xl group flex items-center justify-center bg-slate-900/40">
      <AnimatePresence>
        {error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Access Required</h3>
            <p className="text-slate-400 mb-6 max-w-md">{error}</p>
            <button 
              onClick={requestPermissions}
              className="px-6 py-2 rounded-full medical-gradient text-sm font-bold text-white transition-transform active:scale-95"
            >
              Grant Permission
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="w-24 h-24 rounded-full medical-gradient flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <LucideCamera className="w-12 h-12 text-white" />
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Camera Bridge Active</h3>
              <p className="text-slate-400 text-sm max-w-xs">Tapping the button below will open your native phone camera for a high-accuracy scan.</p>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onStop}
                className="px-6 py-3 rounded-xl glass border-slate-700 text-sm font-bold text-white transition-all active:scale-95"
              >
                Back
              </button>
              <button 
                onClick={takePhoto}
                className="flex items-center gap-3 px-10 py-5 rounded-2xl medical-gradient text-base sm:text-sm font-bold text-white transition-all active:scale-95 shadow-lg shadow-cyan-900/20"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <LucideCamera className="w-6 h-6" />
                )}
                Launch Native Camera
              </button>
            </div>

            {/* Corner Indicators */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30" />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LiveCamera
