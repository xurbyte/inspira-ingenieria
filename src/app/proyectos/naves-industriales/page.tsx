"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";
import { DatabaseProject } from "@/types/database";
import { useProjects } from "@/contexts/projects-context";

export default function NavesIndustrialesPage() {
  const router = useRouter()
  const { projects: allProjects, loading } = useProjects()
  const projects = allProjects['naves-industriales']

  const handleProjectClick = (project: DatabaseProject) => {
    router.push(`/proyectos/naves-industriales/${project.slug}`)
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/#proyectos")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase">Naves Industriales</h1>
              <p className="text-muted-foreground font-semibold">Estructuras metálicas para uso industrial</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-muted-foreground font-medium">Cargando proyectos...</p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No hay proyectos disponibles.</p>
                </div>
              ) : (
                projects.map((project, index) => (
                  <Card
                    key={project.id}
                    className="group cursor-pointer overflow-hidden py-0 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-background border-primary/30 shadow-md hover:shadow-primary/20"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={project.coverImage.src || "/placeholder.svg"}
                        alt={project.coverImage.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        priority={index < 3}
                        style={{
                          viewTransitionName: `project-cover-${project.id}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:bg-gradient-to-t group-hover:from-black/40 transition-all duration-300" />
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant="secondary" 
                          className="bg-white/90 text-foreground shadow-lg"
                          style={{
                            viewTransitionName: `project-year-${project.id}`
                          }}
                        >
                          {project.year}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 
                          className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 uppercase leading-tight"
                          style={{
                            viewTransitionName: `project-title-${project.id}`
                          }}
                        >
                          {project.title}
                        </h3>
                        <div 
                          className="flex items-center text-white/90 text-sm font-medium"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          {project.location}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
