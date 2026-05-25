import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useDevice } from '../hooks/useDevice'
import { QRCodeSVG } from 'qrcode.react'

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

export default function Dashboard({ onLogout }) {
  const device = useDevice()
  const [sessionCode, setSessionCode] = useState(null)
  const [dragging, setDragging] = useState(false)

  const createSession = useMutation(api.sessions.create)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const saveFile = useMutation(api.files.save)

  const files = useQuery(api.files.list, sessionCode ? { sessionCode } : 'skip')

  useEffect(() => {
    createSession().then(setSessionCode)
  }, [createSession])

  const uploadFile = useCallback(async (file) => {
    if (!sessionCode) return
    const uploadUrl = await generateUploadUrl()
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(uploadUrl, { method: 'POST', body: formData })
    const { storageId } = await res.json()
    await saveFile({ sessionCode, name: file.name, size: file.size, type: file.type, storageId })
  }, [sessionCode, generateUploadUrl, saveFile])

  async function handleFileDrop(e) {
    e.preventDefault()
    setDragging(false)
    for (const file of Array.from(e.dataTransfer.files)) {
      await uploadFile(file)
    }
  }

  async function handleFileInput(e) {
    for (const file of Array.from(e.target.files)) {
      await uploadFile(file)
    }
    e.target.value = ''
  }

  function downloadFile(file) {
    if (!file.url) return
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name
    a.click()
  }

  function previewFile(file) {
    if (!file.url) return
    window.open(file.url, '_blank')
  }

  if (!sessionCode) return null

  return (
    <section className="relative z-10 flex min-h-dvh flex-col bg-black">
      <header className="flex items-center justify-between border-b border-zinc-900 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <img src="/icon.jpeg" alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-medium text-white">Vanish</span>
          <span className="ml-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
            Conectado
          </span>
        </div>
        <button
          onClick={onLogout}
          className="cursor-pointer rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 sm:flex-row sm:p-10">
        <div className="flex flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('dash-file-input')?.click()}
            className={`cursor-pointer rounded-xl border border-dashed p-4 text-center transition-all ${
              dragging ? 'border-white bg-white/5' : 'border-zinc-800'
            }`}
          >
            <div className="mb-2 text-4xl">{device === 'mobile' ? '📤' : '📥'}</div>
            <p className="text-sm font-medium text-white">
              {device === 'mobile' ? 'Subí tus archivos' : 'Esperando archivos...'}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              {device === 'mobile'
                ? 'Arrastrá o seleccioná un archivo'
                : 'También podés arrastrar archivos acá'}
            </p>
            <input id="dash-file-input" type="file" multiple className="hidden" onChange={handleFileInput} />
          </div>

          {files && files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(f => (
                <div key={f.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-xs">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">BIN</span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{f.name}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">{formatSize(f.size)}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0 gap-2">
                    {canPreview(f.name) && (
                      <button onClick={() => previewFile(f)} className="cursor-pointer border border-zinc-800 px-3 py-1 text-[11px] text-zinc-400 transition hover:border-zinc-600 hover:text-white">
                        [ver]
                      </button>
                    )}
                    <button onClick={() => downloadFile(f)} className="cursor-pointer border border-white bg-white px-3 py-1 text-[11px] font-medium text-black transition hover:bg-transparent hover:text-white">
                      [descargar]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!files || files.length === 0) && (
            <div className="mt-8 text-center text-xs text-zinc-600">
              <p className="text-zinc-500">Sesión activa: <span className="font-mono font-bold text-white">{sessionCode}</span></p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 sm:w-64">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Código de sesión
          </p>
          <div className="rounded-xl bg-white p-4">
            <QRCodeSVG value={`https://vanish-61a9.vercel.app/?code=${sessionCode}`} size={140} bgColor="#ffffff" fgColor="#000000" />
          </div>
          <p className="text-2xl font-mono font-bold tracking-widest text-white">
            {sessionCode}
          </p>
          <p className="text-xs text-zinc-600">
            Compartí este código o QR
          </p>
        </div>
      </div>
    </section>
  )
}
