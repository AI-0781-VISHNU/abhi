'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Camera, RefreshCw, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LiveCameraProps {
  onCapture: (imageSrc: string) => void
  isAnalyzing: boolean
  onStop?: () => void
}

const LiveCamera = ({ onCapture, isAnalyzing, onStop }: LiveCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setError(null)
      }
    } catch (err) {
      console.error("Camera access error:", err)
      setError("Please grant camera permissions to initialize live analysis.")
    }
  }, [])

  useEffect(() => {
    const initialize = async () => {
      await startCamera()
    }
    initialize()
    
    return () => {
      // Manual cleanup if needed, but handled by navigate or explicit stop
    }
  }, [startCamera])

  // Separate effect for stream cleanup to avoid infinite loop
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraReady(false)
    }
    if (onStop) onStop()
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn("Video metadata not fully loaded yet.")
        return
      }
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageSrc = canvas.toDataURL('image/png')
        onCapture(imageSrc)
      }
    }
  }

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden glass border-slate-800 shadow-2xl group">
      <AnimatePresence>
        {error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 backdrop-blur-md"
          >
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
            <p className="text-slate-400 mb-6 max-w-md">{error}</p>
            <button 
              onClick={startCamera}
              className="px-6 py-2 rounded-full medical-gradient text-sm font-bold text-white transition-transform active:scale-95"
            >
              Retry Access
            </button>
          </motion.div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              onLoadedMetadata={() => setIsCameraReady(true)}
              className="w-full h-full object-cover"
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full border-[20px] border-slate-950/20" />
              <motion.div 
                animate={{ 
                  top: ['10%', '90%', '10%'],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10"
              />
              
              {/* Corner Indicators */}
              <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
              <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
              <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
              <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
              <button 
                onClick={stopCamera}
                className="p-4 rounded-full glass border-slate-700 hover:bg-rose-500/20 text-white transition-all active:scale-90"
                title="Stop Camera"
              >
                <RefreshCw className="w-6 h-6 rotate-45" />
              </button>

              <button 
                onClick={capturePhoto}
                disabled={!isCameraReady || isAnalyzing}
                className={`group relative p-1 rounded-full border-4 ${isAnalyzing ? 'border-slate-700' : 'border-white/20 hover:border-cyan-500/50 transition-colors'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isAnalyzing ? 'bg-slate-800' : 'bg-white group-hover:bg-cyan-400 active:scale-90'}`}>
                  {isAnalyzing ? (
                    <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-900" />
                  )}
                </div>
              </button>
            </div>

            {/* Status Batch */}
            <div className="absolute top-8 left-8 z-20">
              <div className="px-3 py-1.5 rounded-full glass border-slate-700 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isCameraReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  {isCameraReady ? 'Live Feed Active' : 'Initializing...'}
                </span>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default LiveCamera
