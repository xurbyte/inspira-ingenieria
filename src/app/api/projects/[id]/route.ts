import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, rm } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Project, ProjectImage } from '@/types/project'
import cloudinary from '@/lib/cloudinary'
import { getProjectsFromBlob, updateProjectInBlob, deleteProjectFromBlob } from '@/lib/blob-storage'

async function saveUploadedFile(file: File, category: string, projectId: string, type: 'portada' | 'adentro'): Promise<string> {
  // Validate individual file size (max 5MB per file)
  const maxFileSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxFileSize) {
    throw new Error(`File ${file.name} is too large. Maximum size is 5MB per file.`)
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File ${file.name} has invalid type. Only JPEG, PNG, and WebP are allowed.`)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: `inspira-ingenieria/${category}/${projectId}/${type}`,
          public_id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1200, height: 800, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return (uploadResult as { secure_url: string }).secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    
    // Fallback to local storage in development
    if (process.env.NODE_ENV === 'development') {
      const projectDir = path.join(process.cwd(), 'public', 'proyectos', category, projectId, type)

      if (!existsSync(projectDir)) {
        await mkdir(projectDir, { recursive: true })
      }

      const extension = path.extname(file.name)
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`
      const filepath = path.join(projectDir, filename)

      await writeFile(filepath, buffer)
      return `/proyectos/${category}/${projectId}/${type}/${filename}`
    }
    
    throw new Error('Failed to upload image')
  }
}

async function updateProjectInJson(category: string, projectId: string, updatedProject: Project) {
  // Use Vercel Blob in production, fallback to JSON in development
  return await updateProjectInBlob(category, projectId, updatedProject)
}

async function deleteProjectFromJson(category: string, projectId: string) {
  // Use Vercel Blob in production, fallback to JSON in development
  return await deleteProjectFromBlob(category, projectId)
}

async function deleteCloudinaryImages(project: Project, category: string, projectId: string) {
  try {
    const categoryFolderMap: { [key: string]: string } = {
      'viviendas': 'Vivienda',
      'naves-industriales': 'Nave industrial',
      'funcional': 'Funcional'
    }
    
    const categoryFolder = categoryFolderMap[category] || category
    const folderPath = `inspira-ingenieria/${categoryFolder}/${projectId}`
    
    // Delete all images in the project folder from Cloudinary
    const result = await cloudinary.api.delete_resources_by_prefix(folderPath)
    console.log(`Deleted ${result.deleted.length} images from Cloudinary for project ${projectId}`)
    
    // Delete the folder structure in reverse order (deepest first)
    try {
      await cloudinary.api.delete_folder(`${folderPath}/portada`)
    } catch {
      console.log('Portada folder already deleted or does not exist')
    }
    
    try {
      await cloudinary.api.delete_folder(`${folderPath}/adentro`)
    } catch {
      console.log('Adentro folder already deleted or does not exist')
    }
    
    // Finally delete the main project folder
    try {
      await cloudinary.api.delete_folder(folderPath)
      console.log(`Successfully deleted project folder: ${folderPath}`)
    } catch (error) {
      console.error(`Error deleting project folder ${folderPath}:`, error)
      // Force delete by trying to delete any remaining resources
      try {
        await cloudinary.api.delete_resources_by_prefix(folderPath, { type: 'upload', resource_type: 'image' })
        await cloudinary.api.delete_folder(folderPath)
        console.log(`Force deleted project folder: ${folderPath}`)
      } catch (forceError) {
        console.error(`Failed to force delete folder ${folderPath}:`, forceError)
      }
    }
    
    return true
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error)
    return false
  }
}

async function deleteProjectFiles(category: string, projectId: string) {
  const categoryFolderMap: { [key: string]: string } = {
    'viviendas': 'Vivienda',
    'naves-industriales': 'Nave industrial',
    'funcional': 'Funcional'
  }
  
  const categoryFolder = categoryFolderMap[category] || category
  const projectDir = path.join(process.cwd(), 'public', 'proyectos', categoryFolder, projectId)
  
  try {
    if (existsSync(projectDir)) {
      await rm(projectDir, { recursive: true, force: true })
      console.log(`Successfully deleted project directory: ${projectDir}`)
    }
    return true
  } catch (error) {
    console.error('Error deleting project files:', error)
    return false
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const architect = formData.get('architect') as string
    const location = formData.get('location') as string
    const year = formData.get('year') as string
    const system = formData.get('system') as string
    const type = formData.get('type') as string
    const area = formData.get('area') as string
    const description = formData.get('description') as string
    const challenge = formData.get('challenge') as string
    const solution = formData.get('solution') as string
    const result = formData.get('result') as string
    const category = formData.get('category') as string
    
    if (!title || !architect || !location || !year || !system || !type || !area || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const projects = await getProjectsFromBlob(category)
    const currentProject = projects.find((p: Project) => p.id === projectId)
    
    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const categoryFolderMap: { [key: string]: string } = {
      'viviendas': 'Vivienda',
      'naves-industriales': 'Nave industrial',
      'funcional': 'Funcional'
    }
    
    const categoryFolder = categoryFolderMap[category] || category
    
    let coverImagePath = currentProject.coverImage.src
    const coverImageFile = formData.get('coverImage') as File
    if (coverImageFile && coverImageFile.size > 0) {
      coverImagePath = await saveUploadedFile(coverImageFile, categoryFolder, projectId, 'portada')
    }
    
    const detailImages: string[] = [...currentProject.images.map((img: ProjectImage) => img.src)]
    let imageIndex = 0
    
    while (true) {
      const detailImageFile = formData.get(`detailImage_${imageIndex}`) as File
      if (!detailImageFile || detailImageFile.size === 0) break
      
      const detailImagePath = await saveUploadedFile(detailImageFile, categoryFolder, projectId, 'adentro')
      detailImages.push(detailImagePath)
      imageIndex++
    }
    
    const updatedProject = {
      ...currentProject,
      title,
      architect,
      location,
      year,
      system,
      type: type as Project['type'],
      area,
      coverImage: {
        src: coverImagePath,
        alt: `${title} - Vista exterior`
      },
      images: detailImages.map((src: string, index: number): ProjectImage => ({
        src,
        alt: `${title} - Detalle ${index + 1}`
      })),
      description,
      challenge: challenge || '',
      solution: solution || '',
      result: result || '',
      specs: {
        ...currentProject.specs,
        system
      }
    }
    
    const success = await updateProjectInJson(category, projectId, updatedProject)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update project data' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Project updated successfully', 
      project: updatedProject 
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 })
    }
    
    // First, get the project data to access image URLs
    let project: Project | null = null
    
    try {
      const projects = await getProjectsFromBlob(category)
      project = projects.find((p: Project) => p.id === projectId) || null
    } catch (error) {
      console.error('Error reading project data:', error)
    }
    
    // Delete images from Cloudinary if project exists and has Cloudinary images
    if (project) {
      const hasCloudinaryImages = project.coverImage.src.includes('cloudinary.com') || 
                                  project.images.some(img => img.src.includes('cloudinary.com'))
      
      if (hasCloudinaryImages) {
        const cloudinarySuccess = await deleteCloudinaryImages(project, category, projectId)
        if (!cloudinarySuccess) {
          console.warn('Failed to delete images from Cloudinary, but continuing with project deletion')
        }
      }
    }
    
    // Delete project from JSON
    const jsonSuccess = await deleteProjectFromJson(category, projectId)
    if (!jsonSuccess) {
      return NextResponse.json({ error: 'Failed to delete project from database' }, { status: 500 })
    }
    
    // Delete local files (if any)
    const filesSuccess = await deleteProjectFiles(category, projectId)
    if (!filesSuccess) {
      console.warn('Failed to delete local project files, but project was removed from database')
    }
    
    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
