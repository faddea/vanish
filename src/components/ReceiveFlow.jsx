import { useState, useRef, useCallback, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function canPreview(name) {
  return /\.(png|jpe?g|gif|svg|pdf|txt)$/i.test(name)
}

export default function ReceiveFlow({ initialCode = '', onClose }) {
  const [step, setStep] = useState(initialCode.length === 6 ? 'validating' : 'code')
  const [codeInputs, setCodeInputs] = useState(() => {
    if (initialCode.length === 6) return initialCode.split('')
    return Array(6).fill('')
  })
  const [error, setError] = useState('')
  const [sessionCode, setSessionCode] = useState(null)
  const [validating, setValidating] = useState(false)
  const [success, setSuccess] = useState(null)
  const [downloading, setDownloading] = useState(null)
  const inputRefs = useRef([])

  useEffect(() => {
    if (initialCode.length === 6) authenticate(initialCode)
  }, [])

  const code = codeInputs.join('').toUpperCase()
  const validateSession = useMutation(api.sessions.validate)
  const files = useQuery(api.files.list, sessionCode ? { sessionCode } : 'skip')
  const markDownloaded = useMutation(api.files.markDownloaded)
  const removeFile = useMutation(api.files.remove)

  const focusNext = useCallback((i) => {
    if (i < 5) inputRefs.current[i + 1]?.focus()
  }, [])

  const focusPrev = useCallback((i) => {
    if (i > 0) inputRefs.current[i - 1]?.focus()
  }, [])

  function handleInput(value, i) {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const next = [...codeInputs]
    next[i] = char
    setCodeInputs(next)
    setError('')
    if (char && i < 5) focusNext(i)
    if (i === 5 && char) {
      setTimeout(() => authenticate(next.join('')), 100)
    }
  }

  function handleKey(e, i) {
    if (e.key === 'Backspace' && !codeInputs[i] && i > 0) focusPrev(i)
    if (e.key === 'Enter') authenticate(code)
  }

  function handlePaste(e) {
    e.preventDefault()
    const text = (e.clipboardData.getData('text') || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
    const next = [...codeInputs]
    for (let j = 0; j < Math.min(text.length, 6); j++) {
      next[j] = text[j]
    }
    setCodeInputs(next)
    const nextIdx = Math.min(text.length, 5)
    inputRefs.current[nextIdx]?.focus()
    if (text.length >= 6) {
      setTimeout(() => authenticate(next.join('')), 100)
    }
  }

  async function authenticate(enteredCode) {
    if (enteredCode.length < 6) return
    setValidating(true)
    setError('')

    const session = await validateSession({ code: enteredCode })
    if (!session) {
      setError('Código inválido. Verificá e intentá de nuevo.')
      setValidating(false)
      inputRefs.current.forEach(ref => ref?.classList.add('error'))
      setTimeout(() => inputRefs.current.forEach(ref => ref?.classList.remove('error')), 1200)
      return
    }

    setSessionCode(enteredCode)
    setValidating(false)
    setStep('files')
  }

  async function handleDownload(file) {
    if (downloading) return
    setDownloading(file.id)
    if (!file.url) return

    try {
      const res = await fetch(file.url)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)

      setSuccess({ name: file.name })
      await markDownloaded({ fileId: file.id })
      setTimeout(() => removeFile({ fileId: file.id }), 1000)
    } finally {
      setDownloading(null)
    }
  }

  function previewFile(file) {
    if (!file.url) return
    window.open(file.url, '_blank')
  }

  function logout() {
    setStep('code')
    setCodeInputs(Array(6).fill(''))
    setError('')
    setSessionCode(null)
    inputRefs.current[0]?.focus()
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
        <div className="max-w-sm border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="mb-2 text-xs text-zinc-500">[ ok ]</p>
          <h2 className="mb-2 text-sm font-semibold text-white">Archivo descargado</h2>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            <span className="text-white">{success.name}</span> se eliminó del servidor después de la descarga.
          </p>
          <button
            onClick={() => { setSuccess(null); if (files && files.length === 0) logout() }}
            className="mt-6 cursor-pointer border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-[11px] text-zinc-400 transition hover:border-zinc-500 hover:text-white"
          >
            [ cerrar ]
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="relative z-10 flex min-h-dvh flex-col bg-black">
      <header className="flex items-center justify-between border-b border-zinc-900 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <img src="/icon.jpeg" alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-medium text-white">Vanish</span>
          <span className="ml-2 text-xs text-zinc-600">/receive</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {sessionCode && (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                conectado
              </div>
              <button
                onClick={logout}
                className="cursor-pointer rounded-lg border border-zinc-800 bg-transparent px-3 py-1.5 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
              >
                desconectar
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-zinc-800 bg-transparent px-3 py-1.5 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
          >
            cerrar
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-16">
        {step === 'code' && (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="w-full max-w-md border border-zinc-800 bg-zinc-900/30 p-8">
              <h1 className="mb-1 text-left text-sm font-medium tracking-wider text-white">
                Ingresá el código
              </h1>
              <p className="mb-6 text-left text-xs text-zinc-500">
                Escribí el código de 6 caracteres del dispositivo que comparte los archivos.
              </p>

              <div className="my-6 flex items-center justify-between gap-1.5">
                {codeInputs.map((val, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={e => handleInput(e.target.value, i)}
                    onKeyDown={e => handleKey(e, i)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className="code-input"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <p className={`text-xs text-red-400 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
                {error || '.'}
              </p>

              <button
                onClick={() => authenticate(code)}
                disabled={validating}
                className="mt-4 w-full cursor-pointer rounded-xl border border-white bg-white px-5 py-3 text-xs font-medium text-black transition-all hover:bg-transparent hover:text-white disabled:opacity-50"
              >
                {validating ? 'Verificando...' : 'Verificar conexión'}
              </button>

              <div className="mt-6 border-t border-zinc-800 pt-4 text-left text-xs leading-relaxed text-zinc-500">
                <span className="text-white">¿No tenés un código?</span> Tocá "Subir archivo" en el otro dispositivo para generar uno.
              </div>
            </div>
          </div>
        )}

        {step === 'files' && (
          <div className="flex w-full flex-col gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6">
              <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="text-white">Archivos disponibles</span>
                </div>
                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {files ? files.length : 0}
                </span>
              </div>

              {files && files.length > 0 && (
                <div className="space-y-2">
                  {files.map(f => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-xs"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                          BIN
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{f.name}</p>
                          <p className="mt-0.5 text-[10px] text-zinc-500">{formatSize(f.size)}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-shrink-0 gap-2">
                        {canPreview(f.name) && (
                          <button
                            onClick={() => previewFile(f)}
                            className="cursor-pointer rounded-lg border border-zinc-800 px-3 py-1.5 text-[11px] text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                          >
                            [ver]
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(f)}
                          disabled={downloading === f.id}
                          className="cursor-pointer rounded-lg border border-white bg-white px-3 py-1.5 text-[11px] font-medium text-black transition hover:bg-transparent hover:text-white disabled:opacity-50"
                        >
                          {downloading === f.id ? '...' : '[descargar]'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!files || files.length === 0) && (
                <div className="py-16 text-center text-xs">
                  <p className="mb-1 text-zinc-500">Esperando archivos...</p>
                  <p className="text-xs text-zinc-600">
                    Los archivos aparecerán automáticamente cuando el otro dispositivo los suba.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </section>
  )
}
