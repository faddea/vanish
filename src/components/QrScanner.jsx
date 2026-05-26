import { useState, useRef, useEffect, useCallback } from 'react'
import jsQR from 'jsqr'

export default function QrScanner({ onDetected, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState('')
  const [detected, setDetected] = useState(null)
  const [scanning, setScanning] = useState(true)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const scanTimerRef = useRef(null)

  useEffect(() => {
    if ('BarcodeDetector' in window) {
      try {
        detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] })
      } catch {}
    }
  }, [])

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { min: 640, ideal: 1280 },
            height: { min: 480, ideal: 720 },
          },
        })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch {
        setError('No se pudo acceder a la cámara. Verificá los permisos.')
      }
    }
    start()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
      clearTimeout(scanTimerRef.current)
    }
  }, [])

  const scan = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      scanTimerRef.current = setTimeout(scan, 300)
      return
    }

    const detector = detectorRef.current
    if (detector) {
      try {
        const barcodes = await detector.detect(video)
        if (barcodes.length > 0) {
          setDetected(barcodes[0].rawValue)
          setScanning(false)
          return
        }
      } catch {}
    }

    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code) {
      setDetected(code.data)
      setScanning(false)
      return
    }

    scanTimerRef.current = setTimeout(scan, 300)
  }, [])

  useEffect(() => {
    if (scanning) {
      scanTimerRef.current = setTimeout(scan, 300)
    }
    return () => clearTimeout(scanTimerRef.current)
  }, [scanning, scan])

  function confirm() {
    if (detected) {
      onDetected(detected)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
        <span className="text-sm font-medium text-white">Escanear QR</span>
        <button onClick={onClose} className="cursor-pointer text-sm text-zinc-400 hover:text-white">
          ✕ Cerrar
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        {error ? (
          <p className="px-6 text-center text-sm text-red-400">{error}</p>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

            <canvas ref={canvasRef} className="hidden" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-xl border-2 border-white/60" />
            </div>

            {detected && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="mb-2 text-xs text-zinc-500">Código detectado</p>
                  <p className="mb-3 font-mono text-lg font-bold tracking-widest text-white">{detected}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={confirm}
                      className="flex-1 cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => { setDetected(null); setScanning(true) }}
                      className="cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
