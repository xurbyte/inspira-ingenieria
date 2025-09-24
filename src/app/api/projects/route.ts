import { NextRequest, NextResponse } from 'next/server'
import { getProjectService } from '@/lib/dependency-injection'
import { CreateProjectData, UpdateProjectData } from '@/types/database'
import { Category } from '@/types/enums'
import { cloudinaryService } from '@/lib/cloudinary-service'

// Configure runtime and body parser
export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const projectService = getProjectService()
    const formData = await request.formData()

    // Extract form fields
    const title = formData.get('title') as string
    const architect = formData.get('architect') as string
    const location = formData.get('location') as string
    const year = formData.get('year') as string
    const description = formData.get('description') as string
    const challenge = formData.get('challenge') as string
    const solution = formData.get('solution') as string
    const result = formData.get('result') as string
    const category = formData.get('category') as string
    const type = formData.get('type') as string
    const area = formData.get('area') as string

    // Extract specs
    const specsSystem = formData.get('specs.system') as string
    const specsFoundations = formData.get('specs.foundations') as string
    const specsStructure = formData.get('specs.structure') as string
    const specsNormative = formData.get('specs.normative') as string

    // Map category string to enum
    const categoryMap: { [key: string]: Category } = {
      'viviendas': Category.VIVIENDAS,
      'naves-industriales': Category.NAVES_INDUSTRIALES,
      'funcional': Category.FUNCIONAL
    }
    const categoryEnum = categoryMap[category]
    if (!categoryEnum) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Create initial project data without images
    const initialProjectData: CreateProjectData = {
      title,
      architect,
      location,
      year,
      description,
      challenge,
      solution,
      result,
      category: categoryEnum,
      type,
      area: area || undefined,
      specs: {
        system: specsSystem,
        foundations: specsFoundations,
        structure: specsStructure,
        normative: specsNormative
      }
      // coverImage and images will be added in update
    }

    // Create project
    const newProject = await projectService.createProject(initialProjectData)

    // Now upload images using project.id
    let coverImage: { src: string; alt: string } | undefined
    const coverImageFile = formData.get('coverImage') as File | null
    if (coverImageFile) {
      const coverResult = await cloudinaryService.uploadImage(coverImageFile, {
        folder: `${cloudinaryService.getProjectFolder(category, newProject.id)}/cover`,
        publicId: 'cover'
      })
      coverImage = {
        src: coverResult.secure_url,
        alt: title
      }
    } else {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 })
    }

    // Handle additional images
    const additionalImages: { src: string; alt: string }[] = []
    let imageIndex = 0
    while (true) {
      const imageFile = formData.get(`detailImage_${imageIndex}`) as File | null
      if (!imageFile || imageFile.size === 0) break

      const imageResult = await cloudinaryService.uploadImage(imageFile, {
        folder: `${cloudinaryService.getProjectFolder(category, newProject.id)}/images`,
        publicId: `image_${imageIndex + 1}`
      })
      additionalImages.push({
        src: imageResult.secure_url,
        alt: `${title} - Imagen ${imageIndex + 1}`
      })

      imageIndex++
    }

    // Update project with images
    const updateData: UpdateProjectData = {
      id: newProject.id,
      coverImage,
      images: additionalImages
    }

    const finalProject = await projectService.updateProject(updateData)

    return NextResponse.json(finalProject, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/projects:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const projectService = getProjectService()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let projects
    
    if (category) {
      // Get projects for specific category
      projects = await projectService.getProjectsByCategory(category)
    } else {
      // Get all projects
      projects = await projectService.getAllProjects()
    }
    
    const response = NextResponse.json({ projects })
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}