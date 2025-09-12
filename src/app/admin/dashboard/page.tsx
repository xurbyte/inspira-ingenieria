'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Plus, Edit, Trash2, Home, Factory, Building, LogOut } from 'lucide-react'
import Image from 'next/image'
import { DatabaseProject } from '@/types/database'

type Project = DatabaseProject

export default function AdminDashboard() {
  const router = useRouter()
  const { showToast } = useToast()
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog()
  const [selectedCategory, setSelectedCategory] =
    useState<'viviendas' | 'naves-industriales' | 'funcional'>('viviendas')
  const [isDeleting, setIsDeleting] = useState(false)
  const [projectsData, setProjectsData] = useState<{ [key: string]: Project[] }>({
    viviendas: [],
    'naves-industriales': [],
    funcional: [],
  })
  const [loading, setLoading] = useState(true)

  const loadAllProjects = useCallback(async () => {
    setLoading(true)
    try {
      const categories = ['viviendas', 'naves-industriales', 'funcional']
      const projectsPromises = categories.map(async (category) => {
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/projects?category=${category}&t=${timestamp}`, {
          cache: 'no-store',
        })
        const data = await response.json()
        return { category, projects: data.projects || [] }
      })

      const results = await Promise.all(projectsPromises)
      const newProjectsData: { [key: string]: Project[] } = {}
      results.forEach(({ category, projects }) => {
        newProjectsData[category] = projects
      })
      setProjectsData(newProjectsData)
    } catch (error) {
      console.error('Error loading projects:', error)
      showToast('error', 'Error', 'No se pudieron cargar los proyectos')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadAllProjects()
  }, [loadAllProjects])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' }) // borra cookie JWT
    router.push('/admin')
  }

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    showConfirmation({
      title: 'Eliminar Proyecto',
      description: `¿Estás seguro de que quieres eliminar el proyecto "${projectTitle}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'destructive',
      onConfirm: () => performDelete(projectId, projectTitle),
    })
  }

  const performDelete = async (projectId: string, projectTitle: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}?category=${selectedCategory}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el proyecto')
      }
      showToast(
        'success',
        'Proyecto eliminado exitosamente',
        `El proyecto "${projectTitle}" ha sido eliminado correctamente.`
      )
      await loadAllProjects()
    } catch (error) {
      showToast(
        'error',
        'Error al eliminar proyecto',
        error instanceof Error ? error.message : 'Error al eliminar el proyecto.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando proyectos...</p>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'viviendas':
        return <Home className="h-4 w-4" />
      case 'naves-industriales':
        return <Factory className="h-4 w-4" />
      case 'funcional':
        return <Building className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'viviendas':
        return 'Viviendas'
      case 'naves-industriales':
        return 'Naves Industriales'
      case 'funcional':
        return 'Funcional'
      default:
        return category
    }
  }

  const allProjectsData = [
    { category: 'viviendas', projects: projectsData.viviendas },
    { category: 'naves-industriales', projects: projectsData['naves-industriales'] },
    { category: 'funcional', projects: projectsData.funcional },
  ]
  const currentProjects = projectsData[selectedCategory] || []
  const totalProjects = allProjectsData.reduce((acc, cat) => acc + cat.projects.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>
          {allProjectsData.map(({ category, projects }) => (
            <Card key={category}>
              <CardHeader className="flex flex-row justify-between pb-2">
                <CardTitle className="text-sm font-medium">{getCategoryName(category)}</CardTitle>
                {getCategoryIcon(category)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          {(['viviendas', 'naves-industriales', 'funcional'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Proyectos de {getCategoryName(selectedCategory)}</h2>
          <Button onClick={() => router.push('/admin/projects/new')}>
            <Plus className="h-4 w-4 mr-2" /> Nuevo Proyecto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={project.coverImage.src}
                  alt={project.coverImage.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge variant="secondary">{project.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.architect}</p>
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/admin/projects/edit/${project.id}?category=${selectedCategory}`)
                    }
                  >
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProject(project.id, project.title)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {currentProjects.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No hay proyectos</h3>
            <Button onClick={() => router.push(`/admin/projects/new?category=${selectedCategory}`)}>
              <Plus className="h-4 w-4 mr-2" /> Crear Proyecto
            </Button>
          </div>
        )}
      </div>

      <ConfirmationDialog />
    </div>
  )
}
