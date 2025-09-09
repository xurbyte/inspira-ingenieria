import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getProjectService } from '@/lib/dependency-injection'
import { CreateProjectData } from '@/types/database'
import { Category } from '@/types/enums'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})



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
    const system = formData.get('system') as string
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
    const specsRoof = formData.get('specs.roof') as string
    const specsNormative = formData.get('specs.normative') as string
    
    const projectSlug = projectService.generateSlug(title)
    
    // Upload cover image to Cloudinary
    const coverImageFile = formData.get('coverImage') as File
    if (!coverImageFile) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 })
    }
    
    const coverImageBuffer = Buffer.from(await coverImageFile.arrayBuffer())
    const coverImageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: `inspira-ingenieria/${category}/${projectSlug}`,
          public_id: 'cover',
          transformation: [
            { quality: 'auto:good', fetch_format: 'auto' },
            { width: 1200, height: 800, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(coverImageBuffer)
    })
    
    // Handle additional images upload
    const additionalImages = []
    let imageIndex = 0
    
    // Look for detailImage_0, detailImage_1, etc.
    while (true) {
      const imageFile = formData.get(`detailImage_${imageIndex}`) as File
      if (!imageFile || imageFile.size === 0) break
      
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: `inspira-ingenieria/${category}/${projectSlug}/images`,
            public_id: `image-${imageIndex + 1}`,
            transformation: [
              { quality: 'auto:good', fetch_format: 'auto' },
              { width: 1200, height: 800, crop: 'limit' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(imageBuffer)
      })
      
      additionalImages.push({
        src: (imageResult as { secure_url: string }).secure_url,
        alt: `${title} - Imagen ${imageIndex + 1}`
      })
      
      imageIndex++
    }
    
    // Map category string to enum
    const categoryMap: { [key: string]: Category } = {
      'viviendas': Category.VIVIENDAS,
      'naves-industriales': Category.NAVES_INDUSTRIALES,
      'funcional': Category.FUNCIONAL
    }
    const categoryEnum = categoryMap[category]
    
    // Create project data
    const projectData: CreateProjectData = {
      title,
      architect,
      location,
      year,
      system,
      description,
      challenge,
      solution,
      result,
      category: categoryEnum,
      type,
      area: area || undefined,
      coverImage: {
        src: (coverImageResult as { secure_url: string }).secure_url,
        alt: title
      },
      images: additionalImages,
      specs: {
        system: specsSystem,
        foundations: specsFoundations,
        structure: specsStructure,
        roof: specsRoof,
        normative: specsNormative
      }
    }
    
    // Create project using service
    const newProject = await projectService.createProject(projectData)
    
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      error: 'Error al crear el proyecto', 
      details: errorMessage 
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
