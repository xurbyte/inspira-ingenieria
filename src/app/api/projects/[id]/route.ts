import { NextRequest, NextResponse } from 'next/server'
import { getProjectService } from '@/lib/dependency-injection'
import { UpdateProjectData, DatabaseProject, ProjectImage } from '@/types/database'
import { cloudinaryService } from '@/lib/cloudinary-service'
import { Category } from '@/types/enums'

async function deleteCloudinaryImages(project: DatabaseProject, category: string) {
  return cloudinaryService.deleteProjectImages(project, category)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const formData = await request.formData()
    
    const title = formData.get('title') as string || undefined
    const architect = formData.get('architect') as string || undefined
    const location = formData.get('location') as string || undefined
    const year = formData.get('year') as string || undefined
    const type = formData.get('type') as string || undefined
    const area = formData.get('area') as string || undefined
    const description = formData.get('description') as string || undefined
    const challenge = formData.get('challenge') as string || undefined
    const solution = formData.get('solution') as string || undefined
    const result = formData.get('result') as string || undefined
    const category = formData.get('category') as string || undefined
    
    // Extract specs from form data
    const specsSystem = formData.get('specs.system') as string || undefined
    const specsFoundations = formData.get('specs.foundations') as string || undefined
    const specsStructure = formData.get('specs.structure') as string || undefined
    const specsNormative = formData.get('specs.normative') as string || undefined
    
    const projectService = getProjectService()
    const currentProject = await projectService.getProjectById(projectId)
    
    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const currentCategoryString = getCategoryStringFromEnum(currentProject.category)

    let needUrlReplace = false

    if (category && category !== currentCategoryString) {
      const oldBase = cloudinaryService.getProjectFolder(currentCategoryString, currentProject.id)
      const newBase = cloudinaryService.getProjectFolder(category, currentProject.id)

      const resources = await cloudinaryService.getResourcesByPrefix(oldBase)

      for (const asset of resources) {
        const oldId = asset.public_id
        const newId = oldId.replace(oldBase, newBase)
        const success = await cloudinaryService.renameResource(oldId, newId)
        if (!success) {
          console.warn(`Failed to rename ${oldId} to ${newId}`)
        }
      }

      needUrlReplace = true
    }

    const finalCategory = category || currentCategoryString
    const finalBase = cloudinaryService.getProjectFolder(finalCategory, currentProject.id)

    // Handle cover image
    let coverImageSrc = currentProject.coverImage.src
    const coverImageFile = formData.get('coverImage') as File | null
    if (coverImageFile) {
      const uploadResult = await cloudinaryService.updateCoverImage(
        currentProject.coverImage.src,
        coverImageFile,
        finalCategory,
        currentProject.id
      )
      coverImageSrc = uploadResult.secure_url
    } else if (needUrlReplace) {
      coverImageSrc = coverImageSrc.replace(`/${currentCategoryString}/`, `/${finalCategory}/`)
    }

    // Handle additional images
    let imagesPaths = currentProject.images.map(img => img.src)
    if (needUrlReplace) {
      imagesPaths = imagesPaths.map(src => src.replace(`/${currentCategoryString}/`, `/${finalCategory}/`))
    }

    let imageIndex = 0
    const newDetailImages: string[] = []
    while (true) {
      const imageFile = formData.get(`detailImage_${imageIndex}`) as File | null
      if (!imageFile || imageFile.size === 0) break

      const uploadResult = await cloudinaryService.uploadImage(imageFile, {
        folder: `${finalBase}/images`,
        publicId: `image-${imagesPaths.length + imageIndex + 1}`
      })
      newDetailImages.push(uploadResult.secure_url)

      imageIndex++
    }

    imagesPaths = [...imagesPaths, ...newDetailImages]

    // Map category if changed
    let categoryEnum: Category | undefined
    if (category) {
      const categoryMap: { [key: string]: Category } = {
        'viviendas': Category.VIVIENDAS,
        'naves-industriales': Category.NAVES_INDUSTRIALES,
        'funcional': Category.FUNCIONAL
      }
      categoryEnum = categoryMap[category]
      if (!categoryEnum) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    }

    const updateData: UpdateProjectData = {
      id: projectId,
      title,
      architect,
      location,
      year,
      type,
      area,
      description,
      challenge,
      solution,
      result,
      category: categoryEnum,
      coverImage: {
        src: coverImageSrc,
        alt: `${title || currentProject.title} - Vista exterior`
      },
      images: imagesPaths.map((src, index) => ({
        src,
        alt: `${title || currentProject.title} - Detalle ${index + 1}`
      })),
      specs: {
        system: specsSystem ?? currentProject.specs.system,
        foundations: specsFoundations ?? currentProject.specs.foundations,
        structure: specsStructure ?? currentProject.specs.structure,
        normative: specsNormative ?? currentProject.specs.normative
      }
    }

    const updatedProject = await projectService.updateProject(updateData)
    
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
    const categoryParam = searchParams.get('category')
    
    const projectService = getProjectService()
    const project = await projectService.getProjectById(projectId)
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const category = categoryParam || getCategoryStringFromEnum(project.category)
    
    const hasCloudinaryImages = project.coverImage.src.includes('cloudinary.com') || 
                                project.images.some(img => img.src.includes('cloudinary.com'))
    
    if (hasCloudinaryImages) {
      const cloudinarySuccess = await deleteCloudinaryImages(project, category)
      if (!cloudinarySuccess) {
        console.warn('Failed to delete images from Cloudinary, but continuing with project deletion')
      }
    }
    
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

function getCategoryStringFromEnum(category: Category): string {
  const map: { [key in Category]: string } = {
    [Category.VIVIENDAS]: 'viviendas',
    [Category.NAVES_INDUSTRIALES]: 'naves-industriales',
    [Category.FUNCIONAL]: 'funcional'
  }
  return map[category]
}