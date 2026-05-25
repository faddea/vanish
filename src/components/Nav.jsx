import { useState, useEffect, useRef } from 'react'

export default function Nav({ onStart }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef(null)
  const firstFocusableRef = useRef(null)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      firstFocusableRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleStart = () => {
    setMenuOpen(false)
    onStart()
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-zinc-900 bg-black/50 px-6 py-4 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-3">
          <img src="/icon.jpeg" alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-medium text-white">Vanish</span>
        </div>

        <div className="hidden items-center gap-6 sm:flex">
          <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">
            Cómo funciona
          </a>
          <button
            onClick={onStart}
            className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-zinc-200"
          >
            Comenzar
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="cursor-pointer sm:hidden"
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-zinc-900 p-6 shadow-2xl"
            style={{ backgroundColor: '#09090b' }}
          >
            <button
              ref={firstFocusableRef}
              onClick={() => setMenuOpen(false)}
              className="self-end cursor-pointer"
              aria-label="Cerrar menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="mt-12 flex flex-col gap-6">
              <a
                href="#"
                onClick={() => setMenuOpen(false)}
                className="text-lg text-zinc-400 transition-colors hover:text-zinc-200"
              >
                Cómo funciona
              </a>
              <button
                onClick={handleStart}
                className="cursor-pointer rounded-lg bg-white px-4 py-3 text-center text-sm font-medium text-black transition-all hover:bg-zinc-200"
              >
                Comenzar
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
