'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, X, Plus } from 'lucide-react'
import Image from 'next/image'

type ProjectFormData = {
  title: string
  architect: string
  location: string
  year: string
  type: string
  area: string
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
  coverImage: File | null
  detailImages: File[]
}

function NewProjectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [category, setCategory] = useState('')
  const [showCategorySelector, setShowCategorySelector] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    architect: '',
    location: '',
    year: new Date().getFullYear().toString(),
    type: '',
    area: '',
    description: '',
    challenge: '',
    solution: '',
    result: '',
    specs: {
      system: '',
      foundations: '',
      structure: '',
      normative: ''
    },
    coverImage: null,
    detailImages: []
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
    } else {
      setIsAuthenticated(true)
      const categoryParam = searchParams.get('category')
      if (categoryParam) {
        setCategory(categoryParam)
        setShowCategorySelector(false)
      }
    }
  }, [router, searchParams])

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setShowCategorySelector(false)
    setFormData(prev => ({ ...prev, type: '' })) 
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

  const handleSpecsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [field]: value
      }
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

  const validateFiles = () => {
    const maxFileSize = 5 * 1024 * 1024 // 5MB per file
    const maxTotalSize = 10 * 1024 * 1024 // 10MB total
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    let totalSize = 0
    
    // Validate cover image
    if (formData.coverImage) {
      if (formData.coverImage.size > maxFileSize) {
        throw new Error(`La imagen de portada es muy grande. Máximo 5MB por archivo.`)
      }
      if (!allowedTypes.includes(formData.coverImage.type)) {
        throw new Error(`Tipo de archivo no válido para imagen de portada. Solo se permiten JPEG, PNG y WebP.`)
      }
      totalSize += formData.coverImage.size
    }
    
    // Validate detail images
    for (let i = 0; i < formData.detailImages.length; i++) {
      const file = formData.detailImages[i]
      if (file.size > maxFileSize) {
        throw new Error(`La imagen ${i + 1} es muy grande. Máximo 5MB por archivo.`)
      }
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Tipo de archivo no válido para imagen ${i + 1}. Solo se permiten JPEG, PNG y WebP.`)
      }
      totalSize += file.size
    }
    
    if (totalSize > maxTotalSize) {
      throw new Error(`El tamaño total de archivos (${(totalSize / 1024 / 1024).toFixed(1)}MB) excede el límite de 10MB.`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate files before sending
      validateFiles()
      
      const submitData = new FormData()
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'coverImage' && value instanceof File) {
          submitData.append('coverImage', value)
        } else if (key === 'detailImages' && Array.isArray(value)) {
          (value as File[]).forEach((file, index) => {
            submitData.append(`detailImage_${index}`, file)
          })
        } else if (key === 'specs' && value && typeof value === 'object' && !Array.isArray(value)) {
          Object.entries(value as { system: string; foundations: string; structure: string; normative: string }).forEach(([specKey, specValue]) => {
            submitData.append(`specs.${specKey}`, specValue as string)
          })
        } else if (typeof value === 'string' && value !== null && value !== undefined) {
          submitData.append(key, value)
        }
      })
      
      submitData.append('category', category)

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el proyecto')
      }

      showToast('success', 'Proyecto creado exitosamente', `El proyecto "${formData.title}" ha sido creado correctamente.`)
      
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)
      
    } catch (error) {
      console.error('Error creating project:', error)
      showToast('error', 'Error al crear proyecto', error instanceof Error ? error.message : 'Error al crear el proyecto. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Verificando autenticación...</div>
  }

  if (showCategorySelector) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué tipo de proyecto quieres crear?</h2>
            <p className="text-lg text-gray-600">Selecciona la categoría que mejor describa tu proyecto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Viviendas */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCategorySelect('viviendas')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Viviendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Proyectos residenciales y habitacionales</p>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Tipos disponibles:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Tradicional</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Steel Frame</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Wood Frame</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Naves Industriales */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCategorySelect('naves-industriales')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Naves Industriales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Estructuras industriales y comerciales</p>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Tipos disponibles:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Industrial</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Comercial</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Logístico</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funcional */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCategorySelect('funcional')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Funcional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Proyectos con funciones específicas</p>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Tipos disponibles:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Comerciales</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Depósitos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => setShowCategorySelector(true)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cambiar Categoría
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Proyecto - {category.charAt(0).toUpperCase() + category.slice(1)}</CardTitle>
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

                <div className="space-y-2">
                  <Label htmlFor="area">Superficie *</Label>
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

              {/* Technical Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specs_system">Sistema Estructural</Label>
                    <Input
                      id="specs_system"
                      value={formData.specs.system}
                      onChange={(e) => handleSpecsChange('system', e.target.value)}
                      placeholder="Ej: Hormigón armado con acero corrugado"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specs_foundations">Fundaciones</Label>
                    <Input
                      id="specs_foundations"
                      value={formData.specs.foundations}
                      onChange={(e) => handleSpecsChange('foundations', e.target.value)}
                      placeholder="Ej: Zapatas aisladas y corridas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specs_structure">Estructura Principal</Label>
                    <Input
                      id="specs_structure"
                      value={formData.specs.structure}
                      onChange={(e) => handleSpecsChange('structure', e.target.value)}
                      placeholder="Ej: Vigas y columnas de hormigón armado"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specs_normative">Normativa Aplicada</Label>
                    <Input
                      id="specs_normative"
                      value={formData.specs.normative}
                      onChange={(e) => handleSpecsChange('normative', e.target.value)}
                      placeholder="Ej: CIRSOC 201 - 2005"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Imágenes del Proyecto</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sube una imagen de portada y las imágenes de detalle del proyecto.
                  </p>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Imagen de Portada *</Label>
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
                              Seleccionar imagen de portada
                            </span>
                            <input
                              id="coverImage"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleCoverImageChange}
                              required
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detail Images */}
                <div className="space-y-2">
                  <Label htmlFor="detailImages">Imágenes de Detalle</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <Plus className="mx-auto h-8 w-8 text-gray-400" />
                      <label htmlFor="detailImages" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Agregar imágenes de detalle
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
                  {isLoading ? 'Creando...' : 'Crear Proyecto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function NewProject() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <NewProjectContent />
    </Suspense>
  )
}