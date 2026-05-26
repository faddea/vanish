import { useScrollReveal } from '../hooks/useScrollReveal'

function Section({ title, children }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className="reveal">
      <h2 className="mb-4 text-lg font-medium text-white sm:text-xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-400 sm:text-base sm:leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section className="relative z-10 border-t border-zinc-900 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-4xl font-bold text-white sm:text-5xl">Cómo funciona</h1>
        <p className="mb-12 text-sm text-zinc-500 sm:text-base">
          Todo lo que necesitás saber sobre Vanish, explicado simple.
        </p>

        <div className="space-y-16">
          <Section title="¿Qué es Vanish?">
            <p>
              Vanish es una herramienta web para transferir archivos entre dispositivos
              de forma rápida, privada y temporal. Sin necesidad de instalar nada, sin
              crear una cuenta, sin dejar rastro.
            </p>
            <p>
              Funciona enteramente en el navegador. Abrí el sitio desde cualquier
              dispositivo, generás un código único, y compartís archivos al instante.
              Cuando terminás, todo desaparece.
            </p>
          </Section>

          <Section title="¿Cómo se usa?">
            <p>
              Es más simple que mandarte un archivo por WhatsApp o mail:
            </p>
            <ol className="list-inside list-decimal space-y-2 text-zinc-400">
              <li>Abrí Vanish desde cualquier dispositivo.</li>
              <li>Tocá <strong className="text-white">"Subir archivo"</strong> — se genera un código de 6 caracteres y un código QR.</li>
              <li>En el otro dispositivo, escaneá el QR con la cámara o ingresá el código manualmente.</li>
              <li>Los archivos aparecen al instante. Descargalos y se eliminan automáticamente.</li>
            </ol>
          </Section>

          <Section title="Privacidad ante todo">
            <p>
              Vanish fue diseñado pensando en la privacidad desde el primer momento:
            </p>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li><strong className="text-white">Sin cuentas.</strong> No pedimos email, nombre, ni ningún dato personal.</li>
              <li><strong className="text-white">Sin registro.</strong> No hay formularios, no hay contraseñas, no hay "olvidé mi clave".</li>
              <li><strong className="text-white">Sin cookies de seguimiento.</strong> No rastreamos tu actividad ni vendemos datos.</li>
              <li><strong className="text-white">Cifrado en tránsito.</strong> Todo el intercambio de datos viaja cifrado. Nadie puede interceptar lo que transferís.</li>
              <li><strong className="text-white">Cifrado extremo a extremo (próximamente).</strong> El archivo se va a cifrar en tu dispositivo antes de subirse, de forma que ni siquiera el servidor pueda leerlo.</li>
            </ul>
          </Section>

          <Section title="Auto-eliminación: los archivos desaparecen solos">
            <p>
              Cada archivo transferido tiene una vida útil limitada. Esto es clave para
              garantizar tu privacidad:
            </p>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>
                <strong className="text-white">Al descargarlo, se borra.</strong> En el momento en que descargás un archivo
                desde el otro dispositivo, se elimina del servidor para siempre.
              </li>
              <li>
                <strong className="text-white">Si nadie lo descarga, también se borra.</strong> Después de 24 horas,
                el sistema limpia automáticamente cualquier archivo que no se haya descargado.
              </li>
              <li>
                <strong className="text-white">No hay copias.</strong> No queda ningún respaldo, no hay caché en el servidor.
                Una vez eliminado, no hay forma de recuperarlo.
              </li>
            </ul>
          </Section>

          <Section title="¿Qué pasa si cierro el navegador?">
            <p>
              Si cerrás el navegador antes de que el otro dispositivo descargue los archivos,
              no pasa nada. Los archivos siguen guardados en el servidor y el código de sesión
              sigue activo hasta que alguien los descargue o pasen 24 horas.
            </p>
            <p>
              Eso sí: el código de sesión es único. Una vez que se descargan todos los archivos
              o se cumple el tiempo límite, ese código ya no sirve más.
            </p>
          </Section>

          <Section title="Varios dispositivos a la vez">
            <p>
              Una misma sesión puede tener varios receptores. Todos los que ingresen el mismo
              código ven los mismos archivos en tiempo real.
            </p>
            <p>
              Sin embargo, hay algo importante: <strong className="text-white">el primer dispositivo que descargue un archivo
              lo elimina para todos.</strong> Si necesitás que varias personas descarguen el mismo
              archivo, el que lo sube tiene que hacerlo de nuevo.
            </p>
          </Section>

          <Section title="¿En qué se diferencia de WhatsApp Web o Google Drive?">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500">
                    <th className="pb-2 pr-4 font-medium"></th>
                    <th className="pb-2 pr-4 font-medium text-white">Vanish</th>
                    <th className="pb-2 pr-4 font-medium">WhatsApp Web</th>
                    <th className="pb-2 font-medium">Google Drive</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-zinc-900">
                    <td className="py-2 pr-4 text-zinc-500">¿Hay que crear cuenta?</td>
                    <td className="py-2 pr-4 text-white">No</td>
                    <td className="py-2 pr-4">Sí</td>
                    <td className="py-2">Sí</td>
                  </tr>
                  <tr className="border-b border-zinc-900">
                    <td className="py-2 pr-4 text-zinc-500">¿Qué pasa con los archivos?</td>
                    <td className="py-2 pr-4 text-white">Se borran al descargar</td>
                    <td className="py-2 pr-4">Quedan en el chat</td>
                    <td className="py-2">Quedan en la nube</td>
                  </tr>
                  <tr className="border-b border-zinc-900">
                    <td className="py-2 pr-4 text-zinc-500">¿Expira?</td>
                    <td className="py-2 pr-4 text-white">24 hs máximo</td>
                    <td className="py-2 pr-4">Nunca</td>
                    <td className="py-2">Nunca</td>
                  </tr>
                  <tr className="border-b border-zinc-900">
                    <td className="py-2 pr-4 text-zinc-500">¿Comparte datos personales?</td>
                    <td className="py-2 pr-4 text-white">No</td>
                    <td className="py-2 pr-4">Sí (número, contactos)</td>
                    <td className="py-2">Sí (email, archivos)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-zinc-500">¿Se necesita app?</td>
                    <td className="py-2 pr-4 text-white">No, solo el navegador</td>
                    <td className="py-2 pr-4">Sí, WhatsApp en el celu</td>
                    <td className="py-2">Sí, app de Google</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-zinc-600">
              ⚡ Vanish se puede usar desde el navegador sin instalar nada. Si querés,
              podés agregarlo a la pantalla de inicio como una app (PWA) para acceder
              más rápido, pero no es necesario.
            </p>
          </Section>

          <Section title="¿Es seguro?">
            <p>
              Sí, dentro de las limitaciones de diseño del producto:
            </p>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>Toda la comunicación entre tu dispositivo y el servidor está cifrada (HTTPS/TLS).</li>
              <li>No almacenamos ningún dato personal. No hay cuentas, no hay perfiles, no hay historial.</li>
              <li>Los archivos se eliminan automáticamente al descargarse o a las 24 horas.</li>
              <li>No compartimos ni vendemos datos porque directamente no tenemos datos tuyos.</li>
              <li>El código de sesión es aleatorio y de un solo uso.</li>
            </ul>
            <p className="mt-4">
              En una próxima versión, los archivos se cifrarán directamente en tu dispositivo
              antes de subirse, de modo que ni el servidor pueda acceder a su contenido.
            </p>
          </Section>

          <Section title="Límites y consideraciones">
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li><strong className="text-white">Tamaño máximo:</strong> 1 GB por archivo (límite del almacenamiento temporal).</li>
              <li><strong className="text-white">Tiempo máximo:</strong> 24 horas después de la subida, el archivo se elimina automáticamente.</li>
              <li><strong className="text-white">Descargas:</strong> cada archivo solo se puede descargar una vez. Al primer download se elimina para todos.</li>
              <li><strong className="text-white">Sin registro:</strong> si cerrás la sesión y no tenés el código, no hay forma de recuperar los archivos.</li>
            </ul>
          </Section>

          <Section title="¿Preguntas?">
            <p>
              Vanish está en evolución constante. Si tenés dudas, sugerencias
              o querés reportar un problema, escribinos directamente.
            </p>
            <p className="text-zinc-600">
              Este producto está pensado especialmente para entornos educativos:
              escuelas, facultades, laboratorios de computación y cualquier lugar donde
              se compartan dispositivos.
            </p>
          </Section>
        </div>
      </div>
    </section>
  )
}
