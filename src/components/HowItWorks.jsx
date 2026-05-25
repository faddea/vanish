import { useScrollReveal } from '../hooks/useScrollReveal'

const steps = [
  {
    number: '01',
    label: 'Subí',
    desc: 'Arrastrá o seleccioná tu archivo. Se cifra en tu dispositivo antes de subir.',
  },
  {
    number: '02',
    label: 'Escanéá',
    desc: 'En la PC compartida escaneás el QR con tu celular. Sesión instantánea.',
  },
  {
    number: '03',
    label: 'Descargá',
    desc: 'El archivo aparece al instante. Lo descargás y se elimina automáticamente.',
  },
  {
    number: '04',
    label: 'Desaparece',
    desc: 'El archivo se borra del servidor para siempre. Sin rastros. Sin historial.',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative z-10 border-t border-zinc-900 px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
          Cómo funciona
        </h2>

        <div className="mt-16 space-y-24">
          {steps.map((step, i) => (
            <StepRow key={step.label} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepRow({ step, index }) {
  const ref = useScrollReveal()
  const isReversed = index % 2 === 1

  return (
    <div
      ref={ref}
      className="reveal grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-16"
    >
      <div className={isReversed ? 'sm:order-2' : ''}>
        <span className="text-6xl font-bold text-zinc-800 sm:text-7xl">
          {step.number}
        </span>
        <h3 className="mt-2 text-2xl font-medium text-white sm:text-3xl">
          {step.label}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
          {step.desc}
        </p>
      </div>
      <div className={isReversed ? 'sm:order-1' : ''}>
        <img
          src={`/image-${index + 1}.png`}
          alt={step.label}
          className="w-full rounded-2xl"
        />
      </div>
    </div>
  )
}
