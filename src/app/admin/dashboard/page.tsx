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
  const [selectedCategory, setSelectedCategory] = useState<'viviendas' | 'naves-industriales' | 'funcional'>('viviendas')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [projectsData, setProjectsData] = useState<{[key: string]: Project[]}>({
    viviendas: [],
    'naves-industriales': [],
    funcional: []
  })
  const [loading, setLoading] = useState(true)

  const loadAllProjects = useCallback(async () => {
    setLoading(true)
    try {
      const categories = ['viviendas', 'naves-industriales', 'funcional']
      const projectsPromises = categories.map(async (category) => {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/projects?category=${category}&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const data = await response.json()
        return { category, projects: data.projects || [] }
      })

      const results = await Promise.all(projectsPromises)
      const newProjectsData: {[key: string]: Project[]} = {}
      
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
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
    } else {
      setIsAuthenticated(true)
      loadAllProjects()
    }
  }, [router, loadAllProjects])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin')
  }

  const getAllProjects = (): { category: string; projects: Project[] }[] => {
    return [
      { category: 'viviendas', projects: projectsData.viviendas },
      { category: 'naves-industriales', projects: projectsData['naves-industriales'] },
      { category: 'funcional', projects: projectsData.funcional }
    ]
  }

  const getCurrentProjects = (): Project[] => {
    return projectsData[selectedCategory] || []
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

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    showConfirmation({
      title: "Eliminar Proyecto",
      description: `¿Estás seguro de que quieres eliminar el proyecto "${projectTitle}"? Esta acción no se puede deshacer y eliminará todas las imágenes asociadas.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
      onConfirm: () => performDelete(projectId, projectTitle)
    })
  }

  const performDelete = async (projectId: string, projectTitle: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}?category=${selectedCategory}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el proyecto')
      }

      showToast('success', 'Proyecto eliminado exitosamente', `El proyecto "${projectTitle}" ha sido eliminado correctamente.`)
      
      // Reload projects after successful deletion
      await loadAllProjects()
      
    } catch (error) {
      console.error('Error deleting project:', error)
      showToast('error', 'Error al eliminar proyecto', error instanceof Error ? error.message : 'Error al eliminar el proyecto. Por favor, intenta nuevamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Verificando autenticación...</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  const currentProjects = getCurrentProjects()
  const allProjectsData = getAllProjects()
  const totalProjects = allProjectsData.reduce((acc, cat) => acc + cat.projects.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>

          {allProjectsData.map(({ category, projects }) => (
            <Card key={category}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{getCategoryName(category)}</CardTitle>
                {getCategoryIcon(category)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          {(['viviendas', 'naves-industriales', 'funcional'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {getCategoryIcon(category)}
              <span>{getCategoryName(category)}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Proyectos de {getCategoryName(selectedCategory)}
          </h2>
          <Button onClick={() => router.push('/admin/projects/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden pt-0">
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
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{project.architect}</p>
                  </div>
                  <Badge variant="secondary">{project.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Ubicación:</span>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Año:</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Área:</span>
                    <span>{project.area}</span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/admin/projects/edit/${project.id}?category=${selectedCategory}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
            <p className="text-gray-600 mb-4">Comienza creando tu primer proyecto en esta categoría.</p>
            <Button onClick={() => router.push(`/admin/projects/new?category=${selectedCategory}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Proyecto
            </Button>
          </div>
        )}
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </div>
  )
}
