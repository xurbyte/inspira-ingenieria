import Image from "next/image"
import { Linkedin, Mail } from "lucide-react"
import { AxisLine } from "@/components/structural/axis-line"
import { CornerBracket } from "@/components/structural/corner-bracket"

const team = [
  {
    name: "Tomás Portalez",
    title: "Ingeniero Civil — Co-fundador",
    image: "/tomas.jpeg",
    description:
      "Especialista en cálculo estructural y elaboración de memorias técnicas, con experiencia en viviendas, edificios y obras industriales.",
    linkedin: "https://www.linkedin.com/in/tomas-federico-portalez-99603a164/",
    email: "ing.portalez@gmail.com",
  },
  {
    name: "Mateo Portalez",
    title: "Ingeniero Civil — Co-fundador",
    image: "/mateo.jpeg",
    description:
      "Referente en modelado estructural y documentación técnica, integrando arquitectura y cálculo en entornos BIM.",
    linkedin: "https://www.linkedin.com/in/mateo-portalez-35a52a370/",
    email: "ing.mateoportalez@gmail.com",
  },
]

export function TeamSection() {
  return (
    <section id="equipo" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Heading */}
        <div className="mb-16 md:mb-24">
          <div className="label-mono mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
            <span>EQUIPO</span>
          </div>
          <h2 className="heading-section text-foreground mb-6">
            Nuestro Equipo
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Conocé a Tomás y Mateo Portalez, ingenieros civiles fundadores de Inspira
            Ingeniería. Combinamos experiencia técnica y herramientas digitales para diseñar
            estructuras seguras y eficientes, adaptadas a la Patagonia.
          </p>
        </div>

        {/* Team Members — Side by side, content below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {team.map((member, i) => (
            <div key={i} className="relative group">
              {/* Decorative watermark number */}
              <span
                aria-hidden="true"
                className="absolute -top-8 right-4 text-[10rem] md:text-[12rem] font-bold leading-none select-none pointer-events-none text-foreground opacity-[0.04]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Photo */}
              <div className="relative aspect-[4/5] overflow-hidden mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(var(--color-cyan-accent-rgb) / 0.10) 0%, rgba(var(--color-cyan-accent-rgb) / 0.25) 100%)",
                    mixBlendMode: "color",
                  }}
                />
                <CornerBracket position="top-left" size={22} className="top-3 left-3" />
                <CornerBracket position="bottom-right" size={22} className="bottom-3 right-3" />
              </div>

              {/* Info below photo */}
              <div className="relative z-10">
                <div className="label-mono mb-3 flex items-center gap-2">
                  <span className="text-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                  <span className="inline-block w-4 h-px bg-[var(--color-cyan-accent)]" />
                  <span>CO-FUNDADOR</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground uppercase tracking-wide mb-1">
                  {member.name}
                </h3>
                <p className="text-foreground/60 font-semibold text-sm uppercase tracking-wider mb-4">
                  {member.title}
                </p>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-6">
                  {member.description}
                </p>
                <div className="flex items-center gap-5">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-mono text-xs text-muted-foreground hover:text-[var(--color-cyan-accent)] transition-colors flex items-center gap-2 py-1"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                  <AxisLine direction="vertical" className="h-4 opacity-30" />
                  <a
                    href={`mailto:${member.email}`}
                    className="label-mono text-xs text-muted-foreground hover:text-[var(--color-cyan-accent)] transition-colors flex items-center gap-2 py-1"
                    aria-label={`Enviar correo a ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
