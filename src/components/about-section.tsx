import Image from "next/image"
import { AxisLine } from "@/components/structural/axis-line"
import { CornerBracket } from "@/components/structural/corner-bracket"
import { Award, Target, Users, Shield } from "lucide-react"

const differentials = [
  {
    icon: Award,
    title: "Eficiencia Estructural",
    text: "Optimizamos cada proyecto evitando sobredimensionamientos y logrando ahorros de hasta un 10% en materiales.",
  },
  {
    icon: Target,
    title: "Adaptación Local",
    text: "Diseños adaptados a los vientos fuertes, suelos variables y normativas argentinas.",
  },
  {
    icon: Users,
    title: "Equipo Actualizado",
    text: "Trabajamos con software avanzado y metodologías BIM para una mejor coordinación.",
  },
  {
    icon: Shield,
    title: "Socios Confiables",
    text: "Acompañamos desde el anteproyecto, previniendo retrabajos y asegurando claridad técnica.",
  },
]

export function AboutSection() {
  return (
    <section id="nosotros" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Heading */}
        <div className="mb-10">
          <div className="label-mono text-[var(--color-cyan-accent)] mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
            <span>SOBRE NOSOTROS</span>
          </div>
          <h2 className="heading-section text-foreground mb-4">
            Quiénes Somos
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Somos Tomás y Mateo Portalez, ingenieros civiles con experiencia en proyectos que
            van desde viviendas unifamiliares hasta grandes obras industriales en la Patagonia.
          </p>
        </div>

        {/* Panoramic Image Banner */}
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden mb-12">
          <Image
            src="/asd.jpg"
            alt="Tomás y Mateo Portalez trabajando en proyectos estructurales"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Subtle dark gradient overlay for text readability */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-foreground/20"
          />
          <CornerBracket position="top-left" size={24} className="top-3 left-3" />
          <CornerBracket position="bottom-right" size={24} className="bottom-3 right-3" />
        </div>

        {/* Our Story */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-foreground uppercase tracking-wide mb-4">
            Nuestra Historia
          </h3>
          <p className="text-foreground/80 mb-4 leading-relaxed">
            En Inspira Ingeniería nos enfocamos en el cálculo estructural y la optimización de
            proyectos. Usamos herramientas BIM y software avanzado (CYPE, Revit, AutoCAD,
            SketchUp) para transformar ideas arquitectónicas en estructuras seguras y eficientes.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Acompañamos a arquitectos, desarrolladores y constructoras como socios técnicos
            confiables, aportando claridad y eficiencia en cada decisión estructural.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Misión */}
            <div className="py-6 md:py-8 md:pr-12">
              <div className="label-mono text-[var(--color-cyan-accent)] mb-3 flex items-center gap-2">
                <span className="text-foreground/30">01</span>
                <span className="inline-block w-4 h-px bg-[var(--color-cyan-accent)]" />
                <span>MISIÓN</span>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Ayudamos a arquitectos, desarrolladores y constructoras a transformar sus diseños
                en obras seguras y eficientes. Optimizamos cada estructura con criterios técnicos
                claros, adaptados a la realidad constructiva de la Patagonia.
              </p>
            </div>

            {/* Divider */}
            <AxisLine direction="horizontal" className="md:hidden" />

            {/* Visión */}
            <div className="py-6 md:py-8 md:pl-12 md:border-l md:border-border">
              <div className="label-mono text-[var(--color-cyan-accent)] mb-3 flex items-center gap-2">
                <span className="text-foreground/30">02</span>
                <span className="inline-block w-4 h-px bg-[var(--color-cyan-accent)]" />
                <span>VISIÓN</span>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Queremos ser un referente en soluciones estructurales en la Patagonia, creciendo paso a
                paso hacia un estudio integral que acompañe proyectos de mayor escala. Buscamos ser
                reconocidos por nuestra confiabilidad técnica y cercanía profesional.
              </p>
            </div>
          </div>
        </div>

        {/* Differentials — Horizontal strip */}
        <div>
          <div className="label-mono text-[var(--color-cyan-accent)] mb-6 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
            <span>DIFERENCIALES</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50">
            {differentials.map((item, i) => (
              <div key={i} className="bg-background p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[var(--color-cyan-accent)] label-mono text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <item.icon className="h-4 w-4 text-[var(--color-cyan-accent)]" strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wide mb-2">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
