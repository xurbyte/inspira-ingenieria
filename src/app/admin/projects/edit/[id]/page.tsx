'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

import viviendas from '@/data/viviendas.json'
import navesIndustriales from '@/data/naves-industriales.json'
import funcional from '@/data/funcional.json'

type Project = {
  id: string
  title: string
  architect: string
  location: string
  year: string
  system: string
  type: string
  area: string
  coverImage: {
    src: string
    alt: string
  }
  images: {
    src: string
    alt: string
  }[]
  description: string
  challenge: string
  solution: string
  result: string
  specs: {
    system: string
    foundations: string
    structure: string
    normative: string
  }
}

type ProjectFormData = {
  title: string
  architect: string
  location: string
  year: string
  system: string
  type: string
  area: string
  description: string
  challenge: string
  solution: string
  result: string
  coverImage: File | null
  detailImages: File[]
}

export default function EditProject() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState<string>('')
  const [project, setProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    architect: '',
    location: '',
    year: '',
    system: '',
    type: '',
    area: '',
    description: '',
    challenge: '',
    solution: '',
    result: '',
    coverImage: null,
    detailImages: []
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
    } else {
      setIsAuthenticated(true)
      const categoryParam = searchParams.get('category')
      if (categoryParam) {
        setCategory(categoryParam)
        loadProject(categoryParam, projectId)
      }
    }
  }, [router, searchParams, projectId])

  const loadProject = (cat: string, id: string) => {
    let projects: Project[] = []
    
    switch (cat) {
      case 'viviendas':
        projects = viviendas as unknown as Project[]
        break
      case 'naves-industriales':
        projects = navesIndustriales as unknown as Project[]
        break
      case 'funcional':
        projects = funcional as unknown as Project[]
        break
    }

    const foundProject = projects.find(p => p.id === id)
    if (foundProject) {
      setProject(foundProject)
      setFormData({
        title: foundProject.title,
        architect: foundProject.architect,
        location: foundProject.location,
        year: foundProject.year,
        system: foundProject.system,
        type: foundProject.type,
        area: foundProject.area,
        description: foundProject.description,
        challenge: foundProject.challenge || '',
        solution: foundProject.solution || '',
        result: foundProject.result || '',
        coverImage: null,
        detailImages: []
      })
    }
  }

  const getTypeOptions = () => {
    switch (category) {
      case 'viviendas':
        return ['tradicional', 'steelframe', 'woodframe']
      case 'naves-industriales':
        return ['industrial', 'comercial', 'logistico']
      case 'funcional':
        return ['comerciales', 'depositos']
      default:
        return []
    }
  }

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }))
    }
  }

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      detailImages: [...prev.detailImages, ...files]
    }))
  }

  const removeDetailImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      detailImages: prev.detailImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'coverImage' && value instanceof File) {
          submitData.append('coverImage', value)
        } else if (key === 'detailImages' && Array.isArray(value)) {
          (value as File[]).forEach((file, index) => {
            submitData.append(`detailImage_${index}`, file)
          })
        } else if (typeof value === 'string') {
          submitData.append(key, value)
        }
      })
      
      submitData.append('category', category)
      submitData.append('projectId', projectId)

      // Call API to update project
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: submitData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el proyecto')
      }

      alert('Proyecto actualizado exitosamente!')
      router.push('/admin/dashboard')
      
    } catch (error) {
      console.error('Error updating project:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar el proyecto. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (imagePath: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer.')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/images?category=${category}&imagePath=${encodeURIComponent(imagePath)}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la imagen')
      }

      // Update local project state to remove the deleted image
      setProject(prev => {
        if (!prev) return prev
        return {
          ...prev,
          images: prev.images.filter(img => img.src !== imagePath)
        }
      })

      alert('Imagen eliminada exitosamente!')
      
    } catch (error) {
      console.error('Error deleting image:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar la imagen. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}?category=${category}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el proyecto')
      }

      alert('Proyecto eliminado exitosamente!')
      router.push('/admin/dashboard')
      
    } catch (error) {
      console.error('Error deleting project:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar el proyecto. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Verificando autenticación...</div>
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Cargando proyecto...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Editar Proyecto</h1>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Proyecto
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar Proyecto - {project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Casa Familiar - Arq. Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="architect">Arquitecto *</Label>
                  <Input
                    id="architect"
                    value={formData.architect}
                    onChange={(e) => handleInputChange('architect', e.target.value)}
                    placeholder="Ej: Arq. Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ej: Puerto Madryn"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Año *</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="Ej: 2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system">Sistema Constructivo *</Label>
                  <Input
                    id="system"
                    value={formData.system}
                    onChange={(e) => handleInputChange('system', e.target.value)}
                    placeholder="Ej: Hormigón armado"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <select 
                    id="type"
                    value={formData.type} 
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Selecciona un tipo</option>
                    {getTypeOptions().map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="area">Área *</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="Ej: 150 m²"
                    required
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descripción general del proyecto..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge">Desafío</Label>
                  <Textarea
                    id="challenge"
                    value={formData.challenge}
                    onChange={(e) => handleInputChange('challenge', e.target.value)}
                    placeholder="Principales desafíos del proyecto..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Solución</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    placeholder="Soluciones implementadas..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result">Resultado</Label>
                  <Textarea
                    id="result"
                    value={formData.result}
                    onChange={(e) => handleInputChange('result', e.target.value)}
                    placeholder="Resultados obtenidos..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Current Images */}
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Imágenes Actuales</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Las imágenes actuales del proyecto. Puedes subir nuevas imágenes para reemplazarlas.
                  </p>
                </div>

                {/* Current Cover Image */}
                <div className="space-y-2">
                  <Label>Imagen de Portada Actual</Label>
                  <div className="relative w-32 h-32">
                    <Image
                      src={project.coverImage.src}
                      alt={project.coverImage.alt}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </div>

                {/* Current Detail Images */}
                {project.images.length > 0 && (
                  <div className="space-y-2">
                    <Label>Imágenes de Detalle Actuales</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {project.images.map((image: { src: string; alt: string }, index: number) => (
                        <div key={index} className="relative w-full h-24 group">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteImage(image.src)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* New Images */}
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Nuevas Imágenes (Opcional)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sube nuevas imágenes solo si quieres reemplazar las actuales.
                  </p>
                </div>

                {/* New Cover Image */}
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Nueva Imagen de Portada</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {formData.coverImage ? (
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20">
                          <Image
                            src={URL.createObjectURL(formData.coverImage)}
                            alt="Cover preview"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{formData.coverImage.name}</p>
                          <p className="text-xs text-gray-500">
                            {(formData.coverImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="coverImage" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Seleccionar nueva imagen de portada
                            </span>
                            <input
                              id="coverImage"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleCoverImageChange}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* New Detail Images */}
                <div className="space-y-2">
                  <Label htmlFor="detailImages">Nuevas Imágenes de Detalle</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <Plus className="mx-auto h-8 w-8 text-gray-400" />
                      <label htmlFor="detailImages" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Agregar nuevas imágenes de detalle
                        </span>
                        <input
                          id="detailImages"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handleDetailImagesChange}
                        />
                      </label>
                    </div>

                    {formData.detailImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.detailImages.map((file, index) => (
                          <div key={index} className="relative">
                            <div className="relative w-full h-24">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={`Detail ${index + 1}`}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => removeDetailImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/dashboard')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Actualizando...' : 'Actualizar Proyecto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
