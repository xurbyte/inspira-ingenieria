"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Building2, Warehouse, MapPin } from "lucide-react";
import { DatabaseProject } from "@/types/database";
import { useProjects } from "@/contexts/projects-context";
import { CornerBracket, AxisLine } from "@/components/structural";

export default function FuncionalPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"comerciales" | "depositos">("comerciales")
  const { projects: allProjects, loading } = useProjects()
  const projects = allProjects.funcional

  // Group projects by type
  const projectsByType = {
    comerciales: projects.filter(p => p.type === "comerciales"),
    depositos: projects.filter(p => p.type === "depositos"),
  }

  const handleProjectClick = (project: DatabaseProject) => {
    router.push(`/proyectos/funcional/${project.slug}`)
  }

  const filterTabs: Array<{ key: "comerciales" | "depositos"; label: string; icon: React.ReactNode }> = [
    { key: "comerciales", label: "Comerciales", icon: <Building2 className="h-4 w-4" /> },
    { key: "depositos", label: "Depósitos", icon: <Warehouse className="h-4 w-4" /> },
  ]

  return (
    <main className="min-h-screen pt-10 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/#proyectos")}
            className="label-mono text-muted-foreground hover:text-[var(--color-cyan-accent)] transition-colors duration-200 flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="label-mono mb-4 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
              <span>CATEGORÍA</span>
            </div>
            <h1 className="heading-section text-foreground mb-2">Proyectos Funcionales</h1>
            <p className="text-muted-foreground font-medium">Estructuras especializadas para uso comercial y almacenamiento</p>
            <AxisLine direction="horizontal" className="mt-6" color="var(--color-grid-line)" />
          </div>

          {/* Type Filter */}
          <div className="flex flex-nowrap gap-0 mb-8 overflow-x-auto md:overflow-visible border-b border-border">
            {filterTabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={[
                  "label-mono flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-2 -mb-px transition-colors duration-200",
                  selectedType === key
                    ? "border-[var(--color-cyan-accent)] text-[var(--color-cyan-accent)]"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin h-6 w-6 border-b-2 border-[var(--color-cyan-accent)]"></div>
                <p className="label-mono text-muted-foreground">Cargando proyectos...</p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projectsByType[selectedType].length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No hay proyectos de este tipo disponibles.</p>
                </div>
              ) : (
                projectsByType[selectedType].map((project, index) => (
                  <div
                    key={project.id}
                    className="group cursor-pointer border border-border/50 hover:border-[var(--color-cyan-accent)]/40 transition-all duration-300 overflow-hidden"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={project.coverImage.src || "/placeholder.svg"}
                        alt={project.coverImage.alt}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        priority={index < 3}
                        style={{ viewTransitionName: `project-cover-${project.id}` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <CornerBracket position="top-left" size={20} color="var(--color-cyan-accent)" />
                      <CornerBracket position="top-right" size={20} color="var(--color-cyan-accent)" />
                      <CornerBracket position="bottom-left" size={20} color="var(--color-cyan-accent)" />
                      <CornerBracket position="bottom-right" size={20} color="var(--color-cyan-accent)" />

                      {/* Year badge */}
                      <div className="absolute top-4 right-4">
                        <span
                          className="label-mono text-white bg-[var(--color-dark-section)]/90 px-2 py-1 text-xs"
                          style={{ viewTransitionName: `project-year-${project.id}` }}
                        >
                          {project.year}
                        </span>
                      </div>

                      {/* Number label */}
                      <span className="absolute top-4 left-4 label-mono text-white/20 text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3
                          className="text-xl font-bold text-white mb-2 uppercase leading-tight"
                          style={{ viewTransitionName: `project-title-${project.id}` }}
                        >
                          {project.title}
                        </h3>
                        <div className="flex items-center text-white/70 text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-[var(--color-cyan-accent)]" />
                          {project.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
