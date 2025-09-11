import { NextRequest, NextResponse } from 'next/server'
import { getProjectService } from '@/lib/dependency-injection'
import { UpdateProjectData, DatabaseProject, ProjectImage } from '@/types/database'
import { cloudinaryService } from '@/lib/cloudinary-service'

async function uploadImageToCloudinary(
  file: File,
  category: string,
  projectSlug: string,
  imageType: 'cover' | 'additional',
  imageIndex?: number
): Promise<string> {
  const maxFileSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxFileSize) {
    throw new Error(`File ${file.name} is too large. Maximum size is 5MB per file.`)
  }
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File ${file.name} has invalid type. Only JPEG, PNG, and WebP are allowed.`)
  }

  try {
    let folder: string
    let publicId: string

    if (imageType === 'cover') {
      folder = cloudinaryService.getProjectFolder(category, projectSlug)
      publicId = 'cover'
    } else {
      folder = `${cloudinaryService.getProjectFolder(category, projectSlug)}/images`
      publicId = `image-${imageIndex! + 1}`
    }

    const uploadResult = await cloudinaryService.uploadImage(file, {
      folder: folder,
      publicId: publicId
    })

    return uploadResult.secure_url
  } catch (error) {
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function deleteCloudinaryImages(project: DatabaseProject, category: string) {
  return cloudinaryService.deleteProjectImages(project, category)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const architect = formData.get('architect') as string
    const location = formData.get('location') as string
    const year = formData.get('year') as string
    const type = formData.get('type') as string
    const area = formData.get('area') as string
    const description = formData.get('description') as string
    const challenge = formData.get('challenge') as string
    const solution = formData.get('solution') as string
    const result = formData.get('result') as string
    const category = formData.get('category') as string
    
    // Extract specs from form data
    const specsSystem = formData.get('specs.system') as string
    const specsFoundations = formData.get('specs.foundations') as string
    const specsStructure = formData.get('specs.structure') as string
    const specsNormative = formData.get('specs.normative') as string
    
    const projectService = getProjectService()
    const currentProject = await projectService.getProjectById(projectId)
    
    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const projectSlug = getProjectService().generateSlug(currentProject.title)
    
    let coverImagePath = currentProject.coverImage.src
    const coverImageFile = formData.get('coverImage') as File
    if (coverImageFile && coverImageFile.size > 0) {
      coverImagePath = await uploadImageToCloudinary(coverImageFile, category, projectSlug, 'cover')
    }
    
    const detailImages: string[] = [...currentProject.images.map((img: ProjectImage) => img.src)]
    let imageIndex = 0
    
    while (true) {
      const detailImageFile = formData.get(`detailImage_${imageIndex}`) as File
      if (!detailImageFile || detailImageFile.size === 0) break
      
      const detailImagePath = await uploadImageToCloudinary(detailImageFile, category, projectSlug, 'additional', detailImages.length)
      detailImages.push(detailImagePath)
      imageIndex++
    }
    
    const updateData: UpdateProjectData = {
      id: projectId,
      title,
      architect,
      location,
      year,
      type,
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
        system: specsSystem || currentProject.specs?.system || '',
        foundations: specsFoundations || currentProject.specs?.foundations || '',
        structure: specsStructure || currentProject.specs?.structure || '',
        normative: specsNormative || currentProject.specs?.normative || ''
      }
    }
    
    const updatedProject = await projectService.updateProject(updateData)
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Failed to update project data' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Project updated successfully', 
      project: updatedProject 
    }, { status: 200 })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      error: 'Error al actualizar el proyecto', 
      details: errorMessage 
    }, { status: 500 })
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
    
    let project: DatabaseProject | null = null
    
    try {
      const projectService = getProjectService()
      project = await projectService.getProjectById(projectId)
    } catch {
    }
    
    if (project) {
      const hasCloudinaryImages = project.coverImage.src.includes('cloudinary.com') || 
                                  project.images.some(img => img.src.includes('cloudinary.com'))
      
      if (hasCloudinaryImages) {
        const cloudinarySuccess = await deleteCloudinaryImages(project, category)
        if (!cloudinarySuccess) {
          console.warn('Failed to delete images from Cloudinary, but continuing with project deletion')
        }
      }
    }
    
    const projectService = getProjectService()
    await projectService.deleteProject(projectId)
    
    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    }, { status: 200 })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: errorMessage 
    }, { status: 500 })
  }
}
