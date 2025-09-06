import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Project } from '@/types/project'
import cloudinary from '@/lib/cloudinary'
import { addProjectToBlob, getProjectsFromBlob } from '@/lib/blob-storage'

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

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

async function updateProjectsJson(category: string, newProject: Project): Promise<boolean> {
  // Use Vercel Blob in production, fallback to JSON in development
  return await addProjectToBlob(category, newProject)
}

// Configure runtime and body parser
export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    // Add file size validation before processing
    const contentLength = request.headers.get('content-length')
    const maxSize = 10 * 1024 * 1024 // 10MB limit
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json({ 
        error: 'Request too large. Maximum file size is 10MB total.' 
      }, { status: 413 })
    }

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

    const projectId = generateId(title)

    const coverImageFile = formData.get('coverImage') as File
    if (!coverImageFile) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 })
    }

    const categoryFolderMap: { [key: string]: string } = {
      'viviendas': 'Vivienda',
      'naves-industriales': 'Nave industrial',
      'funcional': 'Funcional'
    }

    const categoryFolder = categoryFolderMap[category] || category

    const coverImagePath = await saveUploadedFile(coverImageFile, categoryFolder, projectId, 'portada')

    const detailImages: string[] = []
    let imageIndex = 0

    while (true) {
      const detailImageFile = formData.get(`detailImage_${imageIndex}`) as File
      if (!detailImageFile) break

      const detailImagePath = await saveUploadedFile(detailImageFile, categoryFolder, projectId, 'adentro')
      detailImages.push(detailImagePath)
      imageIndex++
    }

    const newProject: Project = {
      id: projectId,
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
      images: detailImages.map((src, index) => ({
        src,
        alt: `${title} - Detalle ${index + 1}`
      })),
      description,
      challenge,
      solution,
      result,
      specs: {
        system,
        foundations: 'Por definir',
        structure: 'Por definir',
        normative: 'CIRSOC'
      }
    }

    const success = await updateProjectsJson(category, newProject)

    if (!success) {
      return NextResponse.json({ error: 'Failed to save project data' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Project created successfully',
      project: newProject
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 })
    }

    const projects = await getProjectsFromBlob(category)
    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Error reading projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
