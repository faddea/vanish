import { useState, useEffect } from 'react'
import { useDevice } from '../hooks/useDevice'
import QrScanner from './QrScanner'

export default function Hero({ onStart, onReceive }) {
  const device = useDevice()
  const [loaded, setLoaded] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState(0)
  const [scanRow, setScanRow] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 92 ? 0 : prev + 1))
    }, 180)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setScanRow(prev => (prev >= 3 ? 0 : prev + 0.05))
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative z-10 flex min-h-dvh flex-col items-center overflow-hidden px-6 pt-24 pb-24">
      {!loaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <img
            src="/icon.jpeg"
            alt=""
            className="h-14 w-14 animate-pulse rounded-2xl opacity-50"
          />
        </div>
      )}

      <div className="orb" aria-hidden="true" />
      <div className="orb" aria-hidden="true" />
      <div className="orb" aria-hidden="true" />

      <div className={`flex flex-col items-center text-center transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <img
          src="/icon.jpeg"
          alt="Vanish"
          className="logo-bounce mb-6 h-16 w-16 rounded-2xl"
        />

        <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
          Vanish
        </h1>

        <p className="mt-3 text-xl text-zinc-500 sm:text-2xl">
          Subí &rarr; Descargá &rarr; Desaparece
        </p>

        <p className="mt-2 max-w-md text-sm text-zinc-600">
          Pasá archivos entre dispositivos sin cuentas, sin WhatsApp, sin dejar rastro.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onStart}
            className="cursor-pointer rounded-xl bg-white px-8 py-3 font-medium text-black transition-all hover:bg-zinc-200 active:scale-[0.97]"
          >
            Subir archivo
          </button>
          {device === 'mobile' ? (
            <button
              onClick={() => setShowScanner(true)}
              className="cursor-pointer underline underline-offset-4 decoration-neutral-600 px-8 py-3 font-medium text-zinc-400 transition-all hover:border-zinc-600 hover:text-white active:scale-[0.97]"
            >
              📷 Escanear QR
            </button>
          ) : (
            <button
              onClick={onReceive}
              className="cursor-pointer underline underline-offset-4 decoration-neutral-600 px-8 py-3 font-medium text-zinc-400 transition-all hover:border-zinc-600 hover:text-white active:scale-[0.97]"
            >
              Ya tengo un código para recibir
            </button>
          )}
        </div>

        {showScanner && (
          <QrScanner
            onDetected={(code) => {
              const match = code.match(/[?&]code=([A-Z0-9]{6})/i) || code.match(/([A-Z0-9]{6})/)
              const c = match ? match[1] : code
              window.history.replaceState(null, '', `/?code=${c}`)
              onReceive()
            }}
            onClose={() => setShowScanner(false)}
          />
        )}

        <div className={`mt-12 w-full max-w-3xl transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Transferencia segura
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  El archivo se eliminará automáticamente.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Activa
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <div className="rounded-2xl border border-white/5 bg-black/30 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">
                    📄
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">tp-final.pdf</p>
                    <p className="mt-1 text-xs text-zinc-500">14 MB</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-white transition-[width] duration-150 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      Subiendo{'.'.repeat(dots)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center rounded-2xl border border-white/5 bg-black/30 p-5">
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-white p-3">
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const isBlack = [0,2,4,6,8,10,13,14].includes(i)
                        const row = Math.floor(i / 4)
                        const isScanning = Math.floor(scanRow) === row
                        return (
                          <div
                            key={i}
                            className={`h-3 w-3 rounded-sm transition-colors duration-200 ${
                              isBlack && isScanning ? 'bg-purple-300' : isBlack ? 'bg-black' : 'bg-white'
                            }`}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-zinc-500">
                    Escaneá para conectar otro dispositivo
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
              <p className="text-xs text-zinc-500">Sesión temporal • cifrado E2EE</p>
              <p className="text-xs text-zinc-500">Se elimina al descargar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
