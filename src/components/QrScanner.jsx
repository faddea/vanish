import { useState, useRef, useEffect, useCallback } from 'react'
import jsQR from 'jsqr'

export default function QrScanner({ onDetected, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState('')
  const [detected, setDetected] = useState(null)
  const [scanning, setScanning] = useState(true)
  const streamRef = useRef(null)

  useEffect(() => {
    let animId

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
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
      cancelAnimationFrame(animId)
    }
  }, [])

  const scan = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scan)
      return
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

    requestAnimationFrame(scan)
  }, [])

  useEffect(() => {
    if (scanning) {
      requestAnimationFrame(scan)
    }
  }, [scanning, scan])

  function confirm() {
    if (detected) {
      onDetected(detected.replace(/[^A-Z0-9]/gi, '').toUpperCase())
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
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" onLoadedData={scan} />

            <canvas ref={canvasRef} className="hidden" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-xl border-2 border-white/60" />
            </div>

            {detected && (
              <div className="absolute bottom-8 left-4 right-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
