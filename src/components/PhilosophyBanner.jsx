import { useScrollReveal } from '../hooks/useScrollReveal'

export default function PhilosophyBanner() {
  const ref = useScrollReveal()

  return (
    <section
      ref={ref}
      className="reveal relative z-10 border-t border-zinc-900 px-6 py-32 text-center"
    >
      <p className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
        Subí &rarr; descargá &rarr; desaparece
      </p>
      <p className="mt-6 text-sm text-zinc-600">
        Efímero. Seguro. Simple.
      </p>
    </section>
  )
}
