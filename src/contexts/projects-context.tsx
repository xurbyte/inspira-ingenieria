"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { DatabaseProject } from '@/types/database'

interface ProjectsContextType {
  projects: {
    viviendas: DatabaseProject[]
    'naves-industriales': DatabaseProject[]
    funcional: DatabaseProject[]
  }
  loading: boolean
  error: string | null
  refreshProjects: () => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectsContextType['projects']>({
    viviendas: [],
    'naves-industriales': [],
    funcional: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/projects/all')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar proyectos')
      }

      const projectsByCategory = {
        viviendas: [] as DatabaseProject[],
        'naves-industriales': [] as DatabaseProject[],
        funcional: [] as DatabaseProject[]
      }

      data.projects?.forEach((project: DatabaseProject) => {
        if (project.category === 'VIVIENDAS') {
          projectsByCategory.viviendas.push(project)
        } else if (project.category === 'NAVES_INDUSTRIALES') {
          projectsByCategory['naves-industriales'].push(project)
        } else if (project.category === 'FUNCIONAL') {
          projectsByCategory.funcional.push(project)
        }
      })

      setProjects(projectsByCategory)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Error al cargar proyectos')
    } finally {
      setLoading(false)
    }
  }

  const refreshProjects = async () => {
    await fetchAllProjects()
  }

  useEffect(() => {
    fetchAllProjects()
  }, [])

  return (
    <ProjectsContext.Provider value={{ projects, loading, error, refreshProjects }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}
