import { useScrollReveal } from '../hooks/useScrollReveal'

export default function CtaFooter({ onStart }) {
  const ref = useScrollReveal()

  return (
    <footer
      ref={ref}
      className="reveal relative z-10 border-t border-zinc-800 px-6 py-24 text-center"
    >
      <p className="mb-4 text-2xl font-medium text-white sm:text-3xl">
        ¿Listo para probarlo?
      </p>
      <p className="mb-10 text-sm text-zinc-600">
        Sin registro. Sin cuentas. Sin dejar rastro.
      </p>
      <button
        onClick={onStart}
        className="cursor-pointer rounded-xl bg-white px-10 py-4 text-lg font-medium text-black transition-all hover:bg-zinc-200 active:scale-[0.97]"
      >
        Comenzar ahora
      </button>
      <p className="mt-20 text-xs text-zinc-700">
        Vanish &mdash; Transferencia privada y temporal
      </p>
    </footer>
  )
}
