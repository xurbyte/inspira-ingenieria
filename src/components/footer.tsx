import Image from "next/image"
import { AxisLine } from "@/components/structural/axis-line"
import { GridOverlay } from "@/components/structural/grid-overlay"

export function Footer() {
  return (
    <footer className="dark-section py-12 md:py-16 relative overflow-hidden">
      {/* Subtle grid background */}
      <GridOverlay
        className="absolute inset-0"
        color="rgba(255,255,255,0.02)"
        spacing={80}
      />

      {/* Top separator */}
      <AxisLine direction="horizontal" className="absolute top-0 left-0 right-0 opacity-20" />

      <div className="container mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Logo & Description — wider */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold uppercase text-white tracking-wide">
                Inspira Ingeniería
              </span>
            </div>
            <p className="text-white/50 mb-4 max-w-md leading-relaxed text-sm">
              Estudio de ingeniería civil especializado en cálculo estructural
              y soluciones BIM. Transformamos diseños en estructuras seguras y
              eficientes en la Patagonia.
            </p>
            <p className="text-white/30 text-xs">
              Fundado por Tomás y Mateo Portalez en Puerto Madryn, Chubut.
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-3 md:col-start-7">
            <div className="label-mono text-[var(--color-cyan-accent)] mb-4 flex items-center gap-2">
              <span className="inline-block w-4 h-px bg-[var(--color-cyan-accent)]" />
              <span>SERVICIOS</span>
            </div>
            <ul className="space-y-2 text-sm text-white/40">
              <li>Cálculo Estructural</li>
              <li>Modelado BIM</li>
              <li>Memorias de Cálculo</li>
              <li>Asesorías Técnicas</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 md:col-start-10">
            <div className="label-mono text-[var(--color-cyan-accent)] mb-4 flex items-center gap-2">
              <span className="inline-block w-4 h-px bg-[var(--color-cyan-accent)]" />
              <span>CONTACTO</span>
            </div>
            <ul className="space-y-2 text-sm text-white/40">
              <li>Puerto Madryn, Chubut</li>
              <li>+54 9 280 456-3172</li>
              <li>ingenieria.inspira@gmail.com</li>
              <li>@inspira.ing</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-sm text-white/30 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 uppercase">
            <span>© {new Date().getFullYear()} Inspira Ingeniería. Todos los derechos reservados.</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1 normal-case">
              Desarrollado por
              <a
                href="https://xenova.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="underline inline-flex items-center gap-1"
              >
                <Image
                  src="/logoxenova.png"
                  alt="Logo Xenova"
                  width={140}
                  height={35}
                  className="inline-block invert"
                />
              </a>
              .
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
